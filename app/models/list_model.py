from .db import db


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    blurb = db.Column(db.Text)

    user = db.relationship("User", back_populates="lists")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "blurb": self.blurb
        }

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
