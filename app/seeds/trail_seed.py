# POSTMAN
# {
#     "user_id": 1,
#     "name":"Fun Trail",
#     "region":"Va",
#     "curated":true,
#     "overview":"overview",
#     "description":"Description",
#     "difficulty":"easy",
#     "length":5.5,
#     "elevation_gain":1000,
#     "route_type":"loop",
#     "duration_hours":2,
#     "duration_minutes":30,
#     "default_rating":9,
#     "default_weighting":10
# }
import json

from app.models import db, Trail

dct = {
    "Loop": 'loop',
    "Out & back": 'out',
    "Point to point": 'point'
}

def seed_trails():
    undo_trails()

    with open('selenium/scraped.txt') as f:
        lines = f.readline()

        data = json.loads(lines)
        for key in data:
            print(key, data[key])
        trail = Trail(
            user_id=None,
            name=data["name"],
            region=data["region"],
            curated=True,
            overview=data["overview"],
            description=data["description"],
            difficulty=data["difficulty"],
            length=data["length"],
            elevation_gain=data["elevation_gain"],
            route_type=dct[data["route_type"]],
            duration_hours=data["duration_hours"],
            duration_minutes=data["duration_minutes"],
            default_rating=data["default_rating"],
            default_weighting=data["default_weighting"]
        )
        db.session.add(trail)
    db.session.commit()


def undo_trails():
    db.session.execute('TRUNCATE trails RESTART IDENTITY CASCADE;')
    db.session.commit()
