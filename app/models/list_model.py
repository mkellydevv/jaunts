from .db import db


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    blurb = db.Column(db.Text)

    def to_dict(self):
        dct = {
            "id": self.id,
            "userId": self.userId,
            "name": self.name,
            "blurb": self.description
        }

        return dct
