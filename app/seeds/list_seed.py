from app.models import db, List

def seed_lists():
    for i in range(5):
        lst = List(
            user_id=1,
            name=f"List {i}",
            blurb=f"Blurb {i}"
        )
        db.session.add(lst)
    db.session.commit()

def undo_lists():
    db.session.execute('TRUNCATE lists RESTART IDENTITY CASCADE;')
    db.session.commit()
