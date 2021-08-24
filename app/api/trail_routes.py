from flask import Blueprint, request
from flask_login import current_user, login_required
from sqlalchemy import or_
from app.models import db, Trail, tags_trails, Tag, List, Jaunt, Route
from app.forms import TrailForm
from .utils import validation_errors_to_error_messages, extractJoins


bp = Blueprint('trails', __name__)
joinList = ["getCompletedUsers", "getJaunts", "getLists", "getPhotos", "getReviews", "getRoutes", "getTags", "getUser"]


# GET all trails
@bp.route('', methods=['GET'])
def get_trails():
    args = request.args
    joins = extractJoins(args, joinList)

    query = Trail.query

    if args["fromListId"]:
        query = query.filter(Trail.id == Jaunt.trail_id, Jaunt.list_id == args["fromListId"])

    if args["searchName"] != "":
        query = query.filter(Trail.name.ilike(f"%{args['searchName']}%"))

    if args["searchRegion"] != "":
        query = query.filter(Trail.region.ilike(f"%{args['searchRegion']}%"))

    searchTags = args['searchTags'].split(",") if args['searchTags'] else []
    for tag in searchTags:
        query = query.filter(Trail.tags.any(Tag.name.ilike(f"%{tag}%")))

    if args["nw"] != "" and args["se"] != "":
        print("                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        bounds = args["nw"].split(",")
        nw = [float(bounds[0]), float(bounds[1])]
        bounds = args["se"].split(",")
        se = [float(bounds[0]), float(bounds[1])]

        # Note: This does not handle crossing the equator or prime meridian
        query = query.filter(nw[0] > Trail.routes[0].lat).filter(se[0] < Trail.routes[0].lat)
        query = query.filter(nw[1] < Trail.routes[0].lng).filter(se[1] > Trail.routes[0].lng)

    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    trails = query.all()

    return { "trails": [trail.to_dict(joins) for trail in trails] }


# GET a trail
@bp.route('/<int:id>', methods=['GET'])
def get_trail(id):
    args = request.args
    joins = extractJoins(args, joinList)
    trail = Trail.query.get(id)

    if not trail:
        return { "errors": "Trail not found" }, 404

    return trail.to_dict(joins)


# POST a trail
@bp.route('', methods=['POST'])
@login_required
def post_trail():
    form = TrailForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        args = request.args
        joins = extractJoins(args, joinList)
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

        return trail.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# PATCH a trail
@bp.route('/<int:id>', methods=['PATCH'])
@login_required
def patch_trail(id):
    trail = Trail.query.get(id)

    if current_user.id == trail.user_id:
        data = request.json
        for key in data:
            setattr(trail, key, data[key])
        db.session.commit()

        args = request.args
        joins = extractJoins(args, joinList)

        return trail.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401


# DELETE a trail
@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_trail(id):
    trail = Trail.query.get(id)

    if current_user.id == trail.user_id:
        db.session.delete(trail)
        db.session.commit()
        return trail.to_dict()
    else:
        return {"errors": "Unauthorized"}, 401
