from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, FloatField, SelectField, TextAreaField
from wtforms.validators import DataRequired


class TrailForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    region = StringField("region", validators=[DataRequired()])
    curated = BooleanField("completed", validators=[DataRequired()])
    description = TextAreaField('description', validators=[DataRequired()])
    difficulty = SelectField("difficulty", choices=["Easy", "Moderate", "Hard"], validators=[DataRequired()])
    length = FloatField("length", validators=[DataRequired()])
    elevation_gain = IntegerField("elevation_gain", validators=[DataRequired()])
    route_type = SelectField("route_type", choices=["Loop", "Out & back", "Point to point"], validators=[DataRequired()])
    duration_hours = IntegerField("duration_hour", validators=[DataRequired()])
    duration_minutes = IntegerField("duration_minutes", validators=[DataRequired()])
    default_rating = IntegerField("default_rating", validators=[DataRequired()])
    default_weighting = IntegerField("default_weighting", validators=[DataRequired()])
