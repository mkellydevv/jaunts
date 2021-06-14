from app.models import db, List

def seed_lists():
    for i in range(5):
        lst = List(
            user_id=1,
            name=f"VA List 202{i}",
            blurb=f"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        )
        db.session.add(lst)
    db.session.commit()

def undo_lists():
    db.session.execute('TRUNCATE lists RESTART IDENTITY CASCADE;')
    db.session.commit()
