from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Photo
from .utils import extractJoins


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
