from app.models import db, User, completed, Trail
import random

def seed_completed():
    user = User.query.get(1)
    trails = Trail.query.all()

    for trail in trails:
        if random.randint(1,10) > 7:
            user.completed_trails.append(trail)

    db.session.commit()


def undo_completed():
    db.session.execute('TRUNCATE completed RESTART IDENTITY CASCADE;')
    db.session.commit()
