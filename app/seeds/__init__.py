from flask.cli import AppGroup
from .users import seed_users, undo_users
from .tags_trails_seed import seed_tags_trails, undo_tags_trails
from .photo_seed import seed_photos, undo_photos
from .list_seed import seed_lists, undo_lists
from .list_trail_seed import seed_lists_trails, undo_lists_trails
from .review_seed import seed_reviews, undo_reviews

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_tags_trails()
    seed_lists()
    seed_lists_trails()
    seed_photos()
    seed_reviews()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_tags_trails()
    undo_lists()
    undo_lists_trails()
    undo_photos()
    undo_reviews()
