from app.models import db, Trail, Tag
import json
import random

dct = {
    "Loop": "loop",
    "Out & back": "out",
    "Point to point": "point"
}

def seed_tags_trails():
    # Store data for seeding empty table cells
    description_list = []
    tips_list = []
    getting_there_list = []

    with open("selenium/states/virginia/trails.json", "r") as f:
        trails = json.load(f)
        tag_dict = {}

        # Add each trail to the database
        for key in trails:
            t = trails[key]

            # Add any new tags to the database
            for tag_name in t["tags"]:
                if tag_name not in tag_dict:
                    tag = Tag(name=tag_name)
                    tag_dict[tag_name] = tag
                    db.session.add(tag)

            db.session.commit()

            if t["description"]:
                description = t["description"]
                description_list.append(description)
            else:
                description = random.choice(description_list)
            if t["tips"]:
                tips = t["tips"]
                tips_list.append(tips)
            else:
                tips = random.choice(tips_list)
            if t["getting_there"]:
                getting_there = t["getting_there"]
                getting_there_list.append(getting_there)
            else:
                getting_there = random.choice(getting_there_list)

            trail = Trail(
                user_id=None,
                name=t["name"],
                region=t["region"],
                curated=True,
                overview=t["overview"],
                description=description,
                tips=tips,
                getting_there=getting_there,
                difficulty=t["difficulty"],
                length=t["length"],
                elevation_gain=t["elevation_gain"],
                route_type=dct[t["route_type"]],
                duration_hours=t["duration_hours"],
                duration_minutes=t["duration_minutes"],
                default_rating=t["default_rating"],
                default_weighting=t["default_weighting"],
            )

            # Join tags to trail
            for tag_name in t["tags"]:
                trail.tags.append(tag_dict[tag_name])

            db.session.add(trail)

        db.session.commit()


def undo_tags_trails():
    db.session.execute("TRUNCATE trails RESTART IDENTITY CASCADE;")
    db.session.execute("TRUNCATE tags RESTART IDENTITY CASCADE;")
    db.session.commit()
