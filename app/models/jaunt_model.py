from .db import db


class Jaunt(db.Model):
    __tablename__ = "jaunts"

    id = db.Column(db.Integer, primary_key=True)
    trail_id = db.Column(db.Integer, db.ForeignKey("trails.id"), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=False)
    completed = db.Column(db.Boolean, nullable=False)
    review = db.Column(db.Text)
    rating = db.Column(db.Integer)
    blurb = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)

    _list = db.relationship("List", back_populates="jaunts")
    trail = db.relationship("Trail", back_populates="jaunts")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "trail_id": self.trail_id,
            "completed": self.completed,
            "review": self.review,
            "rating": self.rating,
            "blurb": self.blurb,
            "start_date": self.start_date,
            "end_date": self.end_date
        }

        if "list" in joins:
            dct["list"] = self._list.to_dict()

        if "trail" in joins:
            dct["trail"] = self.trail.to_dict()

        return dct
