from .db import db
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
    name = db.Column(db.String, nullable=False)
    region = db.Column(db.String, nullable=False)
    curated = db.Column(db.Boolean, nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum(DifficultyEnum), nullable=False)
    length = db.Column(db.Float, nullable=False)
    elevation_gain = db.Column(db.Integer, nullable=False)
    route_type = db.Column(db.Enum(RouteEnum), nullable=False)
    duration_hours = db.Column(db.Integer, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    default_rating = db.Column(db.Integer, nullable=False)
    default_weighting = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        dct = {
            "id": self.id,
            "name": self.name,
            "region": self.region,
            "curated": self.curated,
            "description": self.description,
            "difficulty": self.difficulty,
            "length": self.length,
            "elevation_gain": self.elevation_gain,
            "route_type": self.route_type,
            "duration_hours": self.duration_hours,
            "duration_minutes": self.duration_minutes,
            "default_rating": self.default_rating,
            "default_weighting": self.default_weighting
        }

        return dct
