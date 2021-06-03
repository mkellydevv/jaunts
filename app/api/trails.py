from flask import Blueprint, request
from app.models import Trail
from app.forms import TrailForm
from .utils import validation_errors_to_error_messages
from flask_login import login_required


bp = Blueprint('trails', __name__)


@bp.route('', methods=['GET'])
def get_trails():
    trails = Trail.query.all()
    return [trail.to_dict() for trail in trails]


@bp.route('/<int:id>', methods=['GET'])
def get_trail(id):
    trail = Trail.query.get(id)
    return trail.to_dict()


@bp.route('', methods=['POST'])
# @login_required
def post_trail():
    form = TrailForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        trail = Trail(
            name=data["name"],
            region=data["region"],
            curated=data["curated"],
            description=data["description"],
            difficulty=data["difficulty"],
            length=data["length"],
            elevation_gain=data["elevation_gain"],
            route_type=data["route_type"],
            duration_hours=data["duration_hours"],
            duration_minutes=data["duration_minutes"],
            default_rating=data["default_rating"],
            default_weighting=data["default_weighting"]
        )
        db.session.add(trail)
        db.session.commit()
        return trail.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
