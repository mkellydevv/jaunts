from flask import Blueprint, request
from app.models import db, List, ListTrail
from app.forms import ListForm
from .utils import validation_errors_to_error_messages
from flask_login import current_user, login_required


bp = Blueprint('lists', __name__)


# GET all lists
@bp.route('', methods=['GET'])
def get_lists():
    args = request.args

    joins = dict()
    if args["getListsTrails"]: joins["lists_trails"] = int(args["getListsTrails"])
    if args["getTrails"]: joins["trails"] = int(args["getTrails"])
    if args["getUser"]: joins["user"] = True

    query = List.query
    if args["fromUserId"]:
        query = query.filter(List.user_id == int(args["fromUserId"]))
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    lists = query.all()

    return { "lists": [lst.to_dict(joins) for lst in lists] }


# GET a list
@bp.route('/<int:id>', methods=['GET'])
def get_list(id):
    args = request.args

    joins = dict()
    if args["getListsTrails"]: joins["lists_trails"] = int(args["getListsTrails"])
    if args["getTrails"]: joins["trails"] = int(args["getTrails"])
    if args["getUser"]: joins["user"] = True

    lst = List.query.get(id)

    return lst.to_dict(joins)


# POST a list
@bp.route('', methods=['POST'])
# @login_required
def post_list():
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        lst = List(
            user_id=data["user_id"],
            name=data["name"],
            blurb=data["blurb"]
        )
        db.session.add(lst)
        db.session.commit()

        args = request.args

        # Optionally add joined tables to returned trails
        joins = dict()
        if args["getTrails"]: joins["trails"] = int(args["getTrails"])
        if args["getUser"]: joins["user"] = True

        return lst.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# PATCH a list
@bp.route('/<int:id>', methods=['PATCH'])
# @login_required
def patch_list(id):
    lst = List.query.get(id)

    if current_user.id == lst.user_id:
        data = request.json
        for key in data:
            setattr(lst, key, data[key])
        db.session.commit()

        args = request.args

        # Optionally add joined tables to returned trails
        joins = dict()
        if args["getTrails"]: joins["trails"] = int(args["getTrails"])
        if args["getUser"]: joins["user"] = True

        return lst.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401


# DELETE a list
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_list(id):
    lst = List.query.get(id)
    if current_user.id == lst.user_id:
        db.session.delete(lst)
        db.session.commit()
        return {}
    else:
        return {"errors": "Unauthorized"}, 401

#######################################################################################
#######################################################################################

# # GET all lists_trails
# @bp.route('/<int:list_id>/trails', methods=['GET'])
# def get_lists_trails(list_id):
#     args = request.args

#     joins = dict()
#     if args["getTrails"]: joins["trails"] = int(args["getTrails"])
#     if args["getUser"]: joins["user"] = True

#     query = ListTrail.query
#     query = query.filter(ListTrail.list_id == list_id)
#     query = query.offset(int(args['offset']) * int(args['limit']))
#     query = query.limit(int(args['limit']))

#     list_trails = query.all()

#     return { "list_trails": [list_trail.to_dict(joins) for list_trail in list_trails] }

# POST a ListTrail
@bp.route('/<int:id>', methods=['POST'])
# @login_required
def post_list_trail(id):
    data = request.json

    if ListTrail.query.filter(ListTrail.trail_id == data["trailId"],ListTrail.list_id == data["listId"]).count() > 0:
        return {"errors": "ListTrail already exists"}, 401

    listTrail = ListTrail(
        trail_id=data["trailId"],
        list_id=data["listId"],
        order=100
    )
    db.session.add(listTrail)
    db.session.commit()

    args = request.args

    # Optionally add joined tables to returned trails
    joins = dict()
    if args["getListsTrails"]: joins["lists_trails"] = int(args["getListsTrails"])
    if args["getTrails"]: joins["trails"] = int(args["getTrails"])
    if args["getUser"]: joins["user"] = True

    lst = List.query.get(id)

    return lst.to_dict(joins)

# DELETE a ListTrail
@bp.route('/<int:list_id>/trails/<int:trail_id>', methods=['DELETE'])
# @login_required
def delete_list_trail(list_id, trail_id):
    args = request.args

    # Optionally add joined tables to returned trails
    joins = dict()
    if args["getListsTrails"]: joins["lists_trails"] = int(args["getListsTrails"])
    if args["getTrails"]: joins["trails"] = int(args["getTrails"])
    if args["getUser"]: joins["user"] = True

    lst = List.query.get(list_id)

    if current_user.id == lst.user_id:
        list_trail = ListTrail.query.filter(ListTrail.list_id == list_id, ListTrail.trail_id == trail_id).first()
        db.session.delete(list_trail)
        db.session.commit()
        return lst.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401
