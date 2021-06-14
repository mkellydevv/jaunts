from app.models import db, ListTrail, List, Trail
import random

def seed_lists_trails():
    lists = List.query.all()
    trails = Trail.query.all()

    for lst in lists:
        samples = random.sample(trails, k = random.randint(5, 15))
        i = 0
        for trail in samples:
            listTrail = ListTrail(
                list_id=lst.id,
                trail_id=trail.id,
                order=i,
                rating=random.randint(1, 5),
                blurb="Lorem Ipsum Blurbem",
                date=f"2021-0{random.randint(1,9)}-0{random.randint(1,9)}"
            )
            i += 1
            db.session.add(listTrail)
    db.session.commit()

def undo_lists_trails():
    db.session.execute('TRUNCATE lists_trails RESTART IDENTITY CASCADE;')
    db.session.commit()
