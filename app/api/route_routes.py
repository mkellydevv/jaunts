from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Route
from .utils import validation_errors_to_error_messages, extractJoins

bp = Blueprint('routes', __name__)
joinList = []

# GET all routes
@bp.route('', methods=['GET'])
def get_routes():
    args = request.args
    joins = extractJoins(args, joinList)

    query = Route.query
    if args["fromTrailId"]:
        query = query.filter(Route.trail_id == int(args["fromTrailId"]))
    query = query.offset(int(args["offset"]) * int(args["limit"]))
    query = query.limit(int(args["limit"]))

    routes = query.all()

    return { "routes": [route.to_dict(joins) for route in routes] }
