from flask import Blueprint, request
from app.models import List
from app.forms import ListForm
from .utils import validation_errors_to_error_messages
from flask_login import login_required


bp = Blueprint('lists', __name__)


@bp.route('', methods=['GET'])
def get_lists():
    lists = List.query.all()
    return [lst.to_dict() for lst in lists]


@bp.route('/<int:id>', methods=['GET'])
def get_list(id):
    lst = List.query.get(id)
    return lst.to_dict()


@bp.route('', methods=['POST'])
# @login_required
def post_list():
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        lst = List(
            userId=data["userId"],
            name=data["name"],
            blurb=data["blurb"]
        )
        db.session.add(lst)
        db.session.commit()
        return lst.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
