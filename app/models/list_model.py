from .db import db

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

        if "getJaunts" in joins:
            dct["jaunts"] = {jaunt.id: jaunt.to_dict() for jaunt in self.jaunts[:int(joins["getJaunts"])]}

        if "getPhotos" in joins:
            dct["photos"] = {photo.id: photo.to_dict() for photo in self.photos[:int(joins["getPhotos"])]}

        if  "getTrails" in joins:
            dct["trails"] = {trail.id: trail.to_dict() for trail in self.trails[:int(joins["getTrails"])]}

        if "getUser" in joins:
            dct["user"] = self.user.to_dict()

        return dct
