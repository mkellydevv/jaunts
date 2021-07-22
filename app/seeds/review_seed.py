from app.models import db, Review, Trail
import json
import random

# reviews.json utilizes bicycle ipsum from https://cogdog.github.io/bicycle-ipsum/

def seed_reviews():
    with open("selenium/states/virginia/reviews.json", "r") as f:
        data = json.load(f)
        reviews = data['reviews_3']
    trails = Trail.query.all()

    for trail in trails:
        for i in range(random.randint(5,10)):
            review = Review(
                trail_id=trail.id,
                user_id=random.randint(1,50),
                rating=random.randint(2, 5),
                blurb=random.choice(reviews),
                date=f"2021-0{random.randint(1,9)}-0{random.randint(1,9)}"
            )
            db.session.add(review)
    db.session.commit()

def undo_reviews():
    db.session.execute('TRUNCATE reviews RESTART IDENTITY CASCADE;')
    db.session.commit()
