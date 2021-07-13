from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, List, Trail, Jaunt
from .utils import extractJoins


bp = Blueprint('jaunts', __name__)
joinList = ["getList", "getTrail"]


# GET all jaunts
@bp.route('', methods=['GET'])
def get_jaunts():
    args = request.args
    joins = extractJoins(args, joinList)

    query = Jaunt.query
    if args["fromListId"]:
        query = query.filter(Jaunt.list_id == int(args["fromListId"]))
    if args["fromTrailId"]:
        query = query.filter(Jaunt.trail_id == int(args["fromTrailId"]))
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    jaunts = query.all()

    return { "jaunts": [jaunt.to_dict(joins) for jaunt in jaunts] }


# GET a jaunt
@bp.route('/<int:id>', methods=['GET'])
def get_jaunt(id):
    args = request.args
    joins = extractJoins(args, joinList)
    jaunt = Jaunt.query.get(id)

    if not jaunt:
        return { "errors": "Jaunt not found" }, 404

    return jaunt.to_dict(joins)

# POST a jaunt
@bp.route('', methods=['POST'])
# @login_required
def post_jaunt():
    args = request.args
    joins = extractJoins(args, joinList)
    data = request.json

    query = Jaunt.query.filter(Jaunt.list_id == data["listId"])
    count = query.count()

    if query.filter(Jaunt.trail_id == data["trailId"]).count() > 0:
        return { "errors": "Jaunt already exists" }, 400

    jaunt = Jaunt(
        list_id=data["listId"],
        trail_id=data["trailId"],
        order=count+1
    )

    db.session.add(jaunt)
    db.session.commit()

    return jaunt.to_dict(joins)


# PATCH a jaunt
@bp.route('/<int:id>', methods=['PATCH'])
# @login_required
def patch_jaunt(id):
    jaunt = Jaunt.query.get(id)
    lst = List.query.get(jaunt.list_id)

    if current_user.id == lst.user_id:
        data = request.json
        for key in data:
            setattr(jaunt, key, data[key])
        db.session.commit()

        args = request.args
        joins = extractJoins(args, joinList)

        return jaunt.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401


# DELETE a jaunt
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_jaunt(id):
    jaunt = Jaunt.query.get(id)
    lst = List.query.get(jaunt.list_id)

    if current_user.id == lst.user_id:
        db.session.delete(jaunt)
        db.session.commit()
        return jaunt.to_dict()
    else:
        return {"errors": "Unauthorized"}, 401
