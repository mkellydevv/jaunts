# Postman
{
    "trail_id": 15,
    "user_id": 1,
    "rating": 9,
    "blurb": "Blurb",
    "date": "2021-6-9"
}

from app.models import db, Review, Trail
import random

def seed_reviews():
    trails = Trail.query.all()

    for trail in trails:
        for i in range(random.randint(5,10)):
            review = Review(
                trail_id=trail.id,
                user_id=random.randint(1,50),
                rating=random.randint(1, 5),
                blurb="Lorem ipsum blurbem sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date=f"2021-0{random.randint(1,9)}-0{random.randint(1,9)}"
            )
            db.session.add(review)
    db.session.commit()

def undo_reviews():
    db.session.execute('TRUNCATE reviews RESTART IDENTITY CASCADE;')
    db.session.commit()
