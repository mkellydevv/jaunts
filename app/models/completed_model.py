from .db import db

completed = db.Table(
    "completed",
    db.Column("trail_id", db.Integer, db.ForeignKey("trails.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"))
)
