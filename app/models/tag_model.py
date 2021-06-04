from .db import db
from .tag_trail_model import tags_trails

class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    trails = db.relationship(
        "Trail",
        secondary=tags_trails,
        back_populates="tags"
    )

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "name": self.name
        }

        if "trails" in joins:
            dct["trails"] = [trail.to_dict() for trail in self.trails]

        return dct
