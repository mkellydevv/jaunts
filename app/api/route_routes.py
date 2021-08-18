from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Route
from .utils import validation_errors_to_error_messages, extractJoins

bp = Blueprint('routes', __name__)
joinList = ["getCoordinates"]

# GET all routes
@bp.route('', methods=['GET'])
def get_routes():
    args = request.args
    joins = extractJoins(args, joinList)

    query = Route.query
    if args["fromTrailId"]:
        query = query.filter(Route.trail_id == int(args["fromTrailId"]))

    if args["nw"] != "" and args["se"] != "":
        bounds = args["nw"].split(",")
        nw = [float(bounds[0]), float(bounds[1])]
        bounds = args["se"].split(",")
        se = [float(bounds[0]), float(bounds[1])]

        # Note: This does not handle crossing the equator or prime meridian
        query = query.filter(nw[0] > Route.lat).filter(se[0] < Route.lat)
        query = query.filter(nw[1] < Route.lng).filter(se[1] > Route.lng)

    # query = query.offset(int(args["offset"]) * int(args["limit"]))
    # query = query.limit(int(args["limit"]))

    routes = query.all()



    return { "routes": [route.to_dict(joins) for route in routes] }
