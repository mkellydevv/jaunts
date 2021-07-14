from .db import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    trail_id = db.Column(db.Integer, db.ForeignKey("trails.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    blurb = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)

    trail = db.relationship("Trail", back_populates="reviews")
    user = db.relationship("User", back_populates="reviews")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "trail_id": self.trail_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "blurb": self.blurb,
            "date": self.date
        }

        if "getTrail" in joins:
            dct["trail"] = self.trail.to_dict()

        if "getUser" in joins:
            dct["user"] = self.user.to_dict()

        return dct
