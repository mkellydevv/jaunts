from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, Completed, Trail
from .utils import extractJoins

bp = Blueprint('users', __name__)
joinList = ["getCompletedTrails"]

@bp.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@bp.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()

# GET a user
@bp.route('/<int:id>', methods=["Get"])
def get_user():
    args = request.args
    joins = extractJoins(args, joinList)
    user = User.query.get(id)

    if not user:
        return { "errors": "User not found" }, 404

    return user.to_dict(joins)
