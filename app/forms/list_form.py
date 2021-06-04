from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField
from wtforms.validators import DataRequired


class ListForm(FlaskForm):
    userId = IntegerField("userId", validators=[DataRequired()])
    name = StringField("name", validators=[DataRequired()])
    blurb = TextAreaField("blurb")
