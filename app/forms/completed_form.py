from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired


class CompletedForm(FlaskForm):
    trail_id = IntegerField("trail_id", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])
