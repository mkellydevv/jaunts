from .db import db

tags_trails = db.Table(
    "tags_trails",
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id")),
    db.Column("trail_id", db.Integer, db.ForeignKey("trails.id"))
)
