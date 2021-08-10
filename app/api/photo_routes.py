from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Photo
from app.forms import PhotoForm
from .utils import validation_errors_to_error_messages, extractJoins
from app.s3_helpers import upload_file_to_s3, allowed_file, get_unique_filename


bp = Blueprint('photo', __name__)
joinList = ["getList", "getTrail", "getUser"]


#GET all photos
@bp.route('', methods=['GET'])
def get_photos():
    args = request.args
    joins = extractJoins(args, joinList)

    query = Photo.query
    if args["fromListId"]:
        query = query.filter(Photo.list_id == args["fromListId"])
    if args["fromTrailId"]:
        query = query.filter(Photo.trail_id == args["fromTrailId"])
    if args["fromUserId"]:
        query = query.filter(Photo.user_id == args["fromUserId"])
    totalCount = query.count()
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    photos = query.all()

    return { "photos": [photo.to_dict(joins) for photo in photos], "totalCount": totalCount }


# GET a photo
@bp.route('/<int:id>', methods=['GET'])
def get_photo(id):
    args = request.args
    joins = extractJoins(args, joinList)
    photo = Photo.query.get(id)

    if not photo:
        return { "errors": "Photo not found" }, 404

    return photo.to_dict(joins)


#POST a photo
@bp.route('', methods=['POST'])
@login_required
def post_photo():
    form = PhotoForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        args = request.args
        joins = extractJoins(args, joinList)
        data = form.data

        if "photo" not in request.files:
            return {"errors": "photo required"}, 400

        photo = request.files["photo"]

        if not allowed_file(photo.filename):
            return {"errors": "file type not permitted"}, 400

        photo.filename = get_unique_filename(photo.filename)

        upload = upload_file_to_s3(photo)
        # upload = {
        #     "url": "https://cdn-assets.alltrails.com/uploads/photo/image/30357109/extra_large_6f087f675229c3e3cb194341514a7ee2.jpg"
        # }

        if "url" not in upload:
            return upload, 400

        newPhoto = Photo(
            list_id=data["list_id"],
            trail_id=data["trail_id"],
            user_id=current_user.id,
            private=data["private"],
            url=upload["url"]
        )
        db.session.add(newPhoto)
        db.session.commit()

        return newPhoto.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE a photo
@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_photo(id):
    photo = Photo.query.get(id)

    if current_user.id == photo.user_id:
        db.session.delete(photo)
        db.session.commit()
        return photo.to_dict()
    else:
        return {"errors": "Unauthorized"}, 401
