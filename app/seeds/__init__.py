from flask.cli import AppGroup
from .users import seed_users, undo_users
from .tags_trails_seed import seed_tags_trails, undo_tags_trails
from .photo_seed import seed_photos, undo_photos
from .list_seed import seed_lists, undo_lists
from .jaunt_seed import seed_jaunts, undo_jaunts
from .review_seed import seed_reviews, undo_reviews
from .completed_seed import seed_completed, undo_completed

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_tags_trails()
    seed_lists()
    seed_jaunts()
    seed_photos()
    seed_reviews()
    seed_completed()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_tags_trails()
    undo_lists()
    undo_jaunts()
    undo_photos()
    undo_reviews()
    undo_completed()
