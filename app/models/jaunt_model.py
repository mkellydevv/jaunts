from .db import db

class Jaunt(db.Model):
    __tablename__ = "jaunts"

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=False)
    trail_id = db.Column(db.Integer, db.ForeignKey("trails.id"), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer)
    blurb = db.Column(db.Text)
    date = db.Column(db.Date)

    _list = db.relationship("List", back_populates="jaunts")
    trail = db.relationship("Trail", back_populates="jaunts")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "list_id": self.list_id,
            "trail_id": self.trail_id,
            "order": self.order,
            "rating": self.rating,
            "blurb": self.blurb,
            "date": self.date
        }

        if "getList" in joins:
            dct["list"] = self._list.to_dict()

        if "getList" in joins:
            dct["trail"] = self.trail.to_dict()

        return dct
