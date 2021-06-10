from app.models import db, Trail, Tag

dct = {
    "Loop": 'loop',
    "Out & back": 'out',
    "Point to point": 'point'
}

def seed_tags_trails():
    undo_tags_trails()

    with open('selenium/states/virginia/info.txt') as f:
        lines = f.readlines()
        tag_dict = {}

        # Add trails to db
        for line in lines:
            data = eval(line[:len(line)-1])

            # Creat tags
            for tag_name in data["tags"]:
                if tag_name not in tag_dict:
                    tag = Tag(name=tag_name)
                    tag_dict[tag_name] = tag
                    db.session.add(tag)

            db.session.commit()

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

            # Join tags to trail
            for tag_name in data["tags"]:
                trail.tags.append(tag_dict[tag_name])

            db.session.add(trail)

        db.session.commit()


def undo_tags_trails():
    db.session.execute('TRUNCATE trails RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE tags RESTART IDENTITY CASCADE;')
    db.session.commit()
