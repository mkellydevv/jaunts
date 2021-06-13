from app.models import db, ListTrail

def seed_lists_trails():
    return

def undo_lists_trails():
    db.session.execute('TRUNCATE lists_trails RESTART IDENTITY CASCADE;')
    db.session.commit()
