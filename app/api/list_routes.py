from flask import Blueprint, request
from app.models import List, db
from app.forms import ListForm
from .utils import validation_errors_to_error_messages
from flask_login import current_user, login_required


bp = Blueprint('lists', __name__)

# GET all lists
@bp.route('', methods=['GET'])
def get_lists():
    lists = List.query.all()
    joins = { "user" }
    return {"lists": [lst.to_dict(joins) for lst in lists] }


# GET a list
@bp.route('/<int:id>', methods=['GET'])
def get_list(id):
    lst = List.query.get(id)
    joins = { "user" }
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
