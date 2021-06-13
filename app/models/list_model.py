from .db import db
from .list_trail_model import ListTrail

class List(db.Model):
    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    blurb = db.Column(db.Text)

    lists_trails = db.relationship("ListTrail", back_populates="_list")
    user = db.relationship("User", back_populates="lists")

    trails = db.relationship(
        "Trail",
        secondary="lists_trails",
        back_populates="lists"
    )

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "blurb": self.blurb
        }

        if "lists_trails" in joins:
            dct["lists_trails"] = [list_trail.to_dict() for list_trail in self.lists_trails]

        if "trails" in joins:
            dct["trails"] = [trail.to_dict() for trail in self.trails]

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
