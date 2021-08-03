from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .completed_model import completed

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(40), nullable = False, unique = True)
    email = db.Column(db.String(255), nullable = False, unique = True)
    hashed_password = db.Column(db.String(255), nullable = False)

    lists = db.relationship("List", back_populates="user")
    photos = db.relationship("Photo", back_populates="user")
    reviews = db.relationship("Review", back_populates="user")
    trails = db.relationship("Trail", back_populates="user")

    completed_trails = db.relationship(
        "Trail",
        secondary=completed,
        back_populates="completed_users"
    )

    @property
    def password(self):
        return self.hashed_password


    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)


    def check_password(self, password):
        return check_password_hash(self.password, password)


    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "username": self.username,
            # "email": self.email
        }

        if "getCompletedTrails" in joins:
            dct["completed_trails"] = [trail.id for trail in self.completed_trails[:int(joins["getCompletedTrails"])]]

        return dct
