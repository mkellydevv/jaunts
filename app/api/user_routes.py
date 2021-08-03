from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User, completed, Trail
from app.forms import CompletedForm
from .utils import validation_errors_to_error_messages, extractJoins

bp = Blueprint('users', __name__)
joinList = ["getCompletedTrails"]


@bp.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


# GET a user
@bp.route('/<int:id>', methods=["GET"])
def get_user(id):
    args = request.args
    joins = extractJoins(args, joinList)
    user = User.query.get(id)

    if not user:
        return { "errors": "User not found" }, 404

    return user.to_dict(joins)

# POST a completed
@bp.route('/<int:user_id>/trails', methods=["POST"])
@login_required
def post_completed(user_id):
    form = CompletedForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        args = request.args
        joins = extractJoins(args, joinList)
        data = form.data

        user = User.query.get(data["user_id"])
        trail = Trail.query.get(data["trail_id"])

        user.completed_trails.append(trail)
        db.session.commit()

        return user.to_dict(joins)
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE a completed
@bp.route('/<int:user_id>/trails/<int:trail_id>', methods=["DELETE"])
@login_required
def delete_completed(user_id, trail_id):
    if current_user.id == user_id:
        args = request.args
        joins = extractJoins(args, joinList)

        user = User.query.get(user_id)
        trail = Trail.query.get(trail_id)
        user.completed_trails.remove(trail)
        db.session.commit()
        return user.to_dict(joins)
    else:
        return {"errors": "Unauthorized"}, 401
