from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, DateField, TextAreaField
from wtforms.validators import DataRequired


class JauntForm(FlaskForm):
    trail_id = IntegerField("trail_id", validators=[DataRequired()])
    list_id = IntegerField("list_id", validators=[DataRequired()])
    completed = BooleanField("completed", validators=[DataRequired()])
    review = TextAreaField("review")
    rating = IntegerField("rating")
    blurb = TextAreaField("blurb")
    start_date = DateField("start_date", validators=[DataRequired()])
    end_date = DateField("end_date")
