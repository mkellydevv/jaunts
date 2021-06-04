from .db import db
from .tag_trail_model import tags_trails
import enum


class DifficultyEnum(enum.Enum):
    easy = "Easy"
    moderate = "Moderate"
    hard = "Hard"


class RouteEnum(enum.Enum):
    loop = "Loop"
    out = "Out & back"
    point = "Point to point"


class Trail(db.Model):
    __tablename__ = "trails"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    name = db.Column(db.String, nullable=False)
    region = db.Column(db.String, nullable=False)
    curated = db.Column(db.Boolean, nullable=False)
    overview = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum(DifficultyEnum), nullable=False)
    length = db.Column(db.Float, nullable=False)
    elevation_gain = db.Column(db.Integer, nullable=False)
    route_type = db.Column(db.Enum(RouteEnum), nullable=False)
    duration_hours = db.Column(db.Integer, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    default_rating = db.Column(db.Integer, nullable=False)
    default_weighting = db.Column(db.Integer, nullable=False)

    jaunts = db.relationship("Jaunt", back_populates="trail")
    user = db.relationship("User", back_populates="trails")

    tags = db.relationship(
        "Tag",
        secondary=tags_trails,
        back_populates="trails"
    )

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "region": self.region,
            "curated": self.curated,
            "overview": self.overview,
            "description": self.description,
            "difficulty": self.difficulty.value,
            "length": self.length,
            "elevation_gain": self.elevation_gain,
            "route_type": self.route_type.value,
            "duration_hours": self.duration_hours,
            "duration_minutes": self.duration_minutes,
            "default_rating": self.default_rating,
            "default_weighting": self.default_weighting,
        }

        if "jaunts" in joins:
            dct["jaunts"] = [jaunt.to_dict() for jaunt in self.jaunts]

        if "tags" in joins:
            dct["tags"] = [tag.to_dict() for tag in self.tags]

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
