"""Added lat and lng to route model

Revision ID: 5237772cde36
Revises: 56a7af75aa4b
Create Date: 2021-08-16 15:44:44.466839

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5237772cde36'
down_revision = '56a7af75aa4b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('routes', sa.Column('lat', sa.Float(), nullable=False))
    op.add_column('routes', sa.Column('lng', sa.Float(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('routes', 'lng')
    op.drop_column('routes', 'lat')
    # ### end Alembic commands ###
