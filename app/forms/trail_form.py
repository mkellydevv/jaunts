from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, FloatField, SelectField, TextAreaField
from wtforms.validators import DataRequired


class TrailForm(FlaskForm):
    user_id = IntegerField("user_id")
    name = StringField("name", validators=[DataRequired()])
    region = StringField("region", validators=[DataRequired()])
    curated = BooleanField("curated", validators=[DataRequired()])
    overview = TextAreaField('overview', validators=[DataRequired()])
    description = TextAreaField('description', validators=[DataRequired()])
    difficulty = SelectField("difficulty", choices=["easy", "moderate", "hard"], validators=[DataRequired()])
    length = FloatField("length", validators=[DataRequired()])
    elevation_gain = IntegerField("elevation_gain", validators=[DataRequired()])
    route_type = SelectField("route_type", choices=["loop", "out", "point"], validators=[DataRequired()])
    duration_hours = IntegerField("duration_hour", validators=[DataRequired()])
    duration_minutes = IntegerField("duration_minutes", validators=[DataRequired()])
    default_rating = IntegerField("default_rating", validators=[DataRequired()])
    default_weighting = IntegerField("default_weighting", validators=[DataRequired()])
