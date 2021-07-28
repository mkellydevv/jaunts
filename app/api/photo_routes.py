from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Photo
from app.forms import PhotoForm
from .utils import validation_errors_to_error_messages, extractJoins


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


#POST a photo
@bp.route('', methods=['POST'])
@login_required
def post_photo():
    form = PhotoForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    print(form.data)

    if form.validate_on_submit():
        args = request.args
        joins = extractJoins(args, joinList)
        # data = request.json
        data = form.data

        if "photo" not in request.json:
            return {"errors": "photo required"}, 400

        # photo = request.files["photo"]
        photo = data["photo"]

        if not allowed_file(photo.filename):
            return {"errors": "file type not permitted"}, 400

        photo.filename = get_unique_filename(photo.filename)

        # upload = upload_file_to_s3(photo)

        # if "url" not in upload:
        #     # if the dictionary doesn't have a url key
        #     # it means that there was an error when we tried to upload
        #     # so we send back that error message
        #     return upload, 400

        newPhoto = Photo(
            list_id=data["listId"],
            trail_id=data["trailId"],
            user_id=current_user.id,
            private=data["private"],
            url=""
            # url=upload["url"]
        )
        db.session.add(newPhoto)
        db.session.commit()

        return newPhoto.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE a photo
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_photo(id):
    photo = Photo.query.get(id)

    if current_user.id == photo.user_id:
        db.session.delete(photo)
        db.session.commit()
        return photo.to_dict()
    else:
        return {"errors": "Unauthorized"}, 401
