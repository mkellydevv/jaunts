from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired


class JauntForm(FlaskForm):
    completed = BooleanField("completed", validators=[DataRequired()])
    review = StringField("review")
    rating = IntegerField("rating")
    blurb = StringField("blurb")
    startDate = StringField("startDate", validators=[DataRequired()])
    endDate = StringField("endDate", validators=[DataRequired()])
