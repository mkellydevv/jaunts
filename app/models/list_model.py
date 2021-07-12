from .db import db
from .jaunt_model import Jaunt

class List(db.Model):
    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    blurb = db.Column(db.Text)

    jaunts = db.relationship("Jaunt", back_populates="_list", cascade="all, delete")
    photos = db.relationship("Photo", back_populates="_list")
    user = db.relationship("User", back_populates="lists")

    trails = db.relationship(
        "Trail",
        secondary="jaunts",
        back_populates="lists"
    )

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "blurb": self.blurb
        }

        if "jaunts" in joins:
            dct["jaunts"] = [jaunt.to_dict() for jaunt in self.jaunts][:joins["jaunts"]]

        if "photos" in joins:
            dct["photos"] = [photo.to_dict() for photo in self.photo][:joins["photos"]]

        if "trails" in joins:
            dct["trails"] = {trail.id: trail.to_dict() for trail in self.trails[:joins["trails"]]}

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
