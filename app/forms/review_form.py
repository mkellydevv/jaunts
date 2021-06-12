from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, DateField, TextAreaField
from wtforms.validators import DataRequired


class ReviewForm(FlaskForm):
    trail_id = IntegerField("trail_id", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])
    rating = IntegerField("rating", validators=[DataRequired()])
    blurb = TextAreaField("blurb", validators=[DataRequired()])
    date = DateField("start_date", validators=[DataRequired()])
