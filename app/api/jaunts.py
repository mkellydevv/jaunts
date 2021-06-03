from flask import Blueprint, request
from app.models import Jaunt
from app.forms import JauntForm
from .utils import validation_errors_to_error_messages
from flask_login import login_required


bp = Blueprint('jaunts', __name__)


@bp.route('')
def get_jaunts():
    jaunts = Jaunt.query.all()
    return jaunts


@bp.route('', methods=['POST'])
# @login_required
def post_jaunt():
    form = JauntForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        return
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
