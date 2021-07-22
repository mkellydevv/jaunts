from werkzeug.security import generate_password_hash
from app.models import db, User
import random
from faker import Faker
fake = Faker()

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password'
    )
    db.session.add(demo)

    for i in range(50):
        name = fake.name()
        demo = User(
            username=name,
            email=f'{name}@aa.io',
            password=f'pass-{random.randint(100, 999)}'
        )
        db.session.add(demo)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
