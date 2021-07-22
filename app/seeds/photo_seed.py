from app.models import db, Photo
import json
import random


def seed_photos():
    with open("selenium/states/virginia/trails.json", "r") as f:
        trails_dct = json.load(f)

    list_ids = [None,None,None,None,None,1,2,3,4,5]

    i = 1
    for key in trails_dct:
        trail = trails_dct[key]

        for url in trail['images']:
            photo = Photo(
                list_id=random.choice(list_ids),
                trail_id=i,
                user_id=random.randint(1,50),
                private=False,
                url=url,
            )
            db.session.add(photo)

        i += 1
    db.session.commit()


def undo_photos():
    db.session.execute('TRUNCATE photos RESTART IDENTITY CASCADE;')
    db.session.commit()
