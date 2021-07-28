from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired


class PhotoForm(FlaskForm):
    list_id = IntegerField("list_id")
    trail_id = IntegerField("trail_id", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])
    _private = BooleanField("private", validators=[DataRequired()])
    url = StringField("url")
