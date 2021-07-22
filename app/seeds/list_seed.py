from app.models import db, List
import json
import random

# reviews.json utilizes bicycle ipsum from https://cogdog.github.io/bicycle-ipsum/

def seed_lists():
    with open("selenium/states/virginia/reviews.json", "r") as f:
        data = json.load(f)
        reviews = data['reviews_3']

    for i in range(5):
        lst = List(
            user_id=1,
            blurb=random.choice(reviews),
            name=f"VA List 202{i}",
            private=False
        )
        db.session.add(lst)
    db.session.commit()

def undo_lists():
    db.session.execute('TRUNCATE lists RESTART IDENTITY CASCADE;')
    db.session.commit()
