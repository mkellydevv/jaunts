from flask import Blueprint, request
from app.models import Trail, User, db
from app.forms import TrailForm
from .utils import validation_errors_to_error_messages
from flask_login import current_user, login_required


bp = Blueprint('trails', __name__)


# GET all trails
@bp.route('', methods=['GET'])
def get_trails():
    trails = Trail.query.join(User).all()
    joins = {
        "user": True
    }
    return { "trails": [trail.to_dict(joins) for trail in trails] }


# GET a trail
@bp.route('/<int:id>', methods=['GET'])
def get_trail(id):
    trail = Trail.query.get(id)
    return trail.to_dict()


# POST a trail
@bp.route('', methods=['POST'])
# @login_required
def post_trail():
    form = TrailForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        trail = Trail(
            user_id=data["user_id"],
            name=data["name"],
            region=data["region"],
            curated=data["curated"],
            overview=data["overview"],
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
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# PATCH a trail
@bp.route('/<int:id>', methods=['PATCH'])
# @login_required
def patch_trail(id):
    trail = Trail.query.get(id)
    if current_user.id == trail.user_id:
        data = request.json
        for key in data:
            setattr(trail, key, data[key])
        db.session.commit()
        return trail.to_dict()
    else:
        return {"errors": "Unauthorized"}



# DELETE a trail
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_trail(id):
    trail = Trail.query.get(id)
    if current_user.id == trail.user_id:
        db.session.delete(trail)
        db.session.commit()
        return trail.to_dict()
    else:
        return {"errors": "Unauthorized"}