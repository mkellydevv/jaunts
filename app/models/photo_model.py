from .db import db


class Photo(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"))
    trail_id = db.Column(db.Integer, db.ForeignKey("trails.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    url = db.Column(db.String, nullable=False)

    _list = db.relationship("List", back_populates="photos")
    trail = db.relationship("Trail", back_populates="photos")
    user = db.relationship("User", back_populates="photos")

    def to_dict(self, joins={}):
        dct = {
            "id": self.id,
            "list_id": self.list_id,
            "trail_id": self.trail_id,
            "user_id": self.user_id,
            "url": self.url
        }

        if "list" in joins:
            dct["list"] = self._list.to_dict()

        if "trail" in joins:
            dct["trail"] = self.trail.to_dict()

        if "user" in joins:
            dct["user"] = self.user.to_dict()

        return dct
