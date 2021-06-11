from app.models import db, Photo

def seed_photos():
    with open('selenium/states/virginia/img_links.txt') as f:
        lines = f.readlines()

        # I didn't store any identifier with the img_links.txt
        # Do this in the future to make attaching IDs more modular
        i = 1
        # Add trails to db
        for line in lines:
            url_list = eval(line)

            for url in url_list:
                photo = Photo(
                    trail_id=i,
                    user_id=None,
                    url=url
                )
                db.session.add(photo)
            i += 1
        db.session.commit()

def undo_photos():
    db.session.execute('TRUNCATE photos RESTART IDENTITY CASCADE;')
    db.session.commit()
