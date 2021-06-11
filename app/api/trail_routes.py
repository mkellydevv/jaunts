from flask import Blueprint, request
from sqlalchemy import or_
from app.models import db, Trail, tags_trails, Tag
from app.forms import TrailForm
from .utils import validation_errors_to_error_messages
from flask_login import current_user, login_required


bp = Blueprint('trails', __name__)


# GET all trails
@bp.route('', methods=['GET'])
def get_trails():
    args = request.args

    searchCats = args['searchCategories'].split(",") if args['searchCategories'] else []
    searchTags = args['searchTags'].split(",") if args['searchTags'] else []

    # Optionally add joined tables to returned trails
    joins = set()
    if args["getJaunts"]: joins.add("jaunts")
    if args["getPhotos"]: joins.add("photos")
    if args["getTags"]: joins.add("tags")
    if args["getUser"]: joins.add("user")

    # Query db with filters
    query = Trail.query
    query = query.filter(
        or_(
            Trail.name.ilike(f"%{args['searchTerm']}%"),
            Trail.region.ilike(f"%{args['searchTerm']}%") if "region" in searchCats else False
        )
    )
    for tag in searchTags:
        query = query.filter(Trail.tags.any(Tag.name.ilike(f"{tag}")))
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    trails = query.all()

    return { "trails": [trail.to_dict(joins) for trail in trails] }


# GET a trail
@bp.route('/<int:id>', methods=['GET'])
def get_trail(id):
    args = request.args

    # Optionally add joined tables to returned trails
    joins = set()
    if args["getJaunts"]: joins.add("jaunts")
    if args["getPhotos"]: joins.add("photos")
    if args["getTags"]: joins.add("tags")
    if args["getUser"]: joins.add("user")

    trail = Trail.query.get(id)

    return trail.to_dict(joins)


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
