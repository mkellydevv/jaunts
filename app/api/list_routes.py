from flask import Blueprint, request
from app.models import db, List, ListTrail
from app.forms import ListForm
from .utils import validation_errors_to_error_messages
from flask_login import current_user, login_required


bp = Blueprint('lists', __name__)


# GET all lists
@bp.route('', methods=['GET'])
def get_lists():
    lists = List.query.all()
    joins = { "user", "trails" }
    return {"lists": [lst.to_dict(joins) for lst in lists] }


# GET a list
@bp.route('/<int:id>', methods=['GET'])
def get_list(id):
    args = request.args

    # Optionally add joined tables to returned trails
    joins = set()
    if args["getListsTrails"]: joins.add("lists_trails")
    if args["getTrails"]: joins.add("trails")
    if args["getUser"]: joins.add("user")

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
        return lst.to_dict()
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
        return lst.to_dict()
    else:
        return {"errors": "Unauthorized"}


# DELETE a list
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_list(id):
    lst = List.query.get(id)
    if current_user.id == lst.user_id:
        db.session.delete(lst)
        db.session.commit()
        return lst.to_dict()
    else:
        return {"errors": "Unauthorized"}
