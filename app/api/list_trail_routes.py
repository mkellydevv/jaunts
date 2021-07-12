from flask import Blueprint, request
from app.models import db, List, Trail, ListTrail
from flask_login import current_user, login_required

bp = Blueprint('list_trails', __name__)

# GET all lists_trails
@bp.route('', methods=['GET'])
def get_list_trails():
    args = request.args
    joins = { "getList": args["getList"], "getTrail": args["getTrail"] }

    query = ListTrail.query
    if args["fromListId"]:
        query = query.filter(ListTrail.list_id == int(args["fromListId"]))
    if args["fromTrailId"]:
        query = query.filter(ListTrail.trail_id == int(args["fromTrailId"]))
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    list_trails = query.all()

    return { "list_trails": [list_trail.to_dict(joins) for list_trail in list_trails] }


# POST a list_trail
@bp.route('', methods=['POST'])
# @login_required
def post_list_trail():
    args = request.args
    joins = { "getList": args["getList"], "getTrail": args["getTrail"] }
    data = request.json

    query = ListTrail.query.filter(ListTrail.list_id == data["listId"])
    count = query.count()

    if query.filter(ListTrail.trail_id == data["trailId"]).count() > 0:
        return {"errors": "ListTrail already exists"}, 401

    list_trail = ListTrail(
        list_id=data["listId"],
        trail_id=data["trailId"],
        order=count+1
    )
    db.session.add(list_trail)
    db.session.commit()

    return list_trail.to_dict(joins)

# DELETE a list_trail
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_list_trail(id):
    list_trail = ListTrail.query.get(id)
    lst = List.query.get(list_trail.list_id)
    if current_user.id == lst.user_id:
        db.session.delete(list_trail)
        db.session.commit()
        return list_trail.to_dict()
    else:
        return {"errors": "Unauthorized"}, 401
