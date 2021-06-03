from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, DateField
from wtforms.validators import DataRequired


class JauntForm(FlaskForm):
    completed = BooleanField("completed", validators=[DataRequired()])
    review = StringField("review")
    rating = IntegerField("rating")
    blurb = StringField("blurb")
    startDate = DateField("startDate", validators=[DataRequired()])
    endDate = DateField("endDate", validators=[DataRequired()])
