from app.models import db, Jaunt, List, Trail
import json
import random

# reviews.json utilizes bicycle ipsum from https://cogdog.github.io/bicycle-ipsum/

def seed_jaunts():
    lists = List.query.all()
    trails = Trail.query.all()

    with open("selenium/states/virginia/reviews.json", "r") as f:
        data = json.load(f)
        reviews = data['reviews_3']

    for lst in lists:
        samples = random.sample(trails, k = random.randint(3, 8))
        i = 0
        for trail in samples:
            jaunt = Jaunt(
                list_id=lst.id,
                trail_id=trail.id,
                order=i,
                rating=random.randint(2, 5),
                blurb=random.choice(reviews),
                date=f"2021-0{random.randint(1,9)}-0{random.randint(1,9)}"
            )
            i += 1
            db.session.add(jaunt)
    db.session.commit()

def undo_jaunts():
    db.session.execute('TRUNCATE jaunts RESTART IDENTITY CASCADE;')
    db.session.commit()
