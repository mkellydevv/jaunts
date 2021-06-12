from flask import Blueprint, request
from app.models import Review, List, db
from app.forms import ReviewForm
from .utils import validation_errors_to_error_messages
from flask_login import login_required


bp = Blueprint('reviews', __name__)


# GET all reviews
@bp.route('', methods=['GET'])
def get_reviews():
    args = request.args

    # Optionally add joined tables to returned trails
    joins = set()
    if args["getUser"]: joins.add("user")

    # Query db with filters
    query = Review.query
    query = query.filter(Review.trail_id == args["fromTrailId"])
    query = query.offset(int(args['offset']) * int(args['limit']))
    query = query.limit(int(args['limit']))

    reviews = query.all()

    return {"reviews": [review.to_dict(joins) for review in reviews] }


# GET a review
@bp.route('/<int:id>', methods=['GET'])
def get_review(id):
    review = Review.query.get(id)
    joins = { "trail", "list" }
    return review.to_dict(joins)


# POST a review
@bp.route('', methods=['POST'])
# @login_required
def post_review():
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        review = Review(
            trail_id=data["trail_id"],
            user_id=data["user_id"],
            rating=data["rating"],
            blurb=data["blurb"],
            date=data["date"]
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401



# PATCH a review
@bp.route('/<int:id>', methods=['PATCH'])
# @login_required
def patch_review(id):
    review = Review.query.get(id)
    lst = List.query.get(review.list_id)
    if current_user.id == lst.user_id:
        data = request.json
        for key in data:
            setattr(review, key, data[key])
        db.session.commit()
        return review.to_dict()
    else:
        return {"errors": "Unauthorized"}


# DELETE a review
@bp.route('/<int:id>', methods=['DELETE'])
# @login_required
def delete_review(id):
    review = Review.query.get(id)
    lst = List.query.get(review.list_id)
    if current_user.id == lst.user_id:
        db.session.delete(review)
        db.session.commit()
        return review.to_dict()
    else:
        return {"errors": "Unauthorized"}
