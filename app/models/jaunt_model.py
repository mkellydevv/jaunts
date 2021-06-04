from .db import db


class Jaunt(db.Model):
    __tablename__ = "jaunts"

    id = db.Column(db.Integer, primary_key=True)
    completed = db.Column(db.Boolean)
    review = db.Column(db.Text)
    rating = db.Column(db.Integer)
    blurb = db.Column(db.Text, nullable=False)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
