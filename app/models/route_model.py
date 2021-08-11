from .db import db

class Route(db.Model):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    trail_id = db.Column(db.Integer, db.ForeignKey("trails.id"))
    coordinates = db.Column(db.ARRAY(db.Float), nullable=False)

    trail = db.relationship("Trail", back_populates="routes")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "trail_id": self.trail_id,
            "coordinates": self.coordinates,
        }

        if "getTrail" in joins:
            dct["trail"] = self.trail.to_dict()

        return dct
