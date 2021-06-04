from flask import Blueprint, request
from app.models import Jaunt, List, db
from app.forms import JauntForm
from .utils import validation_errors_to_error_messages
from flask_login import login_required


bp = Blueprint('jaunts', __name__)


# GET all jaunts
@bp.route('', methods=['GET'])
def get_jaunts():
    jaunts = Jaunt.query.all()
    joins = { "trail", "list" }
    return {"jaunts": [jaunt.to_dict(joins) for jaunt in jaunts] }


# GET a jaunt
@bp.route('/<int:id>', methods=['GET'])
def get_jaunt(id):
    jaunt = Jaunt.query.get(id)
    joins = { "trail", "list" }
    return jaunt.to_dict(joins)


# POST a jaunt
@bp.route('', methods=['POST'])
# @login_required
def post_jaunt():
    form = JauntForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        jaunt = Jaunt(
            trail_id=data["trail_id"],
            list_id=data["list_id"],
            completed=data["completed"],
            review=data["review"],
            rating=data["rating"],
            blurb=data["blurb"],
            start_date=data["start_date"],
            end_date=data["end_date"]
        )
        db.session.add(jaunt)
        db.session.commit()
        return jaunt.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401



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
        return jaunt.to_dict()
    else:
        return {"errors": "Unauthorized"}


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
        return {"errors": "Unauthorized"}
