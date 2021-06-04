from .db import db


class List(db.Model):
    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    blurb = db.Column(db.Text)

    jaunts = db.relationship("Jaunt", back_populates="_list")
    user = db.relationship("User", back_populates="lists")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "blurb": self.blurb
        }

        if "jaunts" in joins:
            dct["user"] = self.user.to_dict()

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
