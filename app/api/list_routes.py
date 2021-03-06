from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, List
from app.forms import ListForm
from .utils import validation_errors_to_error_messages, extractJoins


bp = Blueprint('lists', __name__)
joinList = ["getJaunts", "getPhotos", "getTrails", "getUser"]


# GET all lists
@bp.route('', methods=['GET'])
@login_required
def get_lists():
    args = request.args
    joins = extractJoins(args, joinList)

    query = List.query
    if args["fromUserId"]:
        query = query.filter(List.user_id == int(args["fromUserId"]))
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    lists = query.all()

    return { "lists": [lst.to_dict(joins) for lst in lists] }


# GET a list
@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_list(id):
    args = request.args
    joins = extractJoins(args, joinList)
    lst = List.query.get(id)

    if not lst:
        return { "errors": "List not found" }, 404

    return lst.to_dict(joins)


# POST a list
@bp.route('', methods=['POST'])
@login_required
def post_list():
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        args = request.args
        joins = extractJoins(args, joinList)
        data = form.data

        lst = List(
            user_id=data["user_id"],
            name=data["name"],
            blurb=data["blurb"]
        )

        db.session.add(lst)
        db.session.commit()

        return lst.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# PATCH a list
@bp.route('/<int:id>', methods=['PATCH'])
@login_required
def patch_list(id):
    lst = List.query.get(id)

    if current_user.id == lst.user_id:
        data = request.json
        for key in data:
            setattr(lst, key, data[key])
        db.session.commit()

        args = request.args
        joins = extractJoins(args, joinList)

        return lst.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401


# DELETE a list
@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_list(id):
    lst = List.query.get(id)

    if current_user.id == lst.user_id:
        db.session.delete(lst)
        db.session.commit()
        return {}
    else:
        return {"errors": "Unauthorized"}, 401
