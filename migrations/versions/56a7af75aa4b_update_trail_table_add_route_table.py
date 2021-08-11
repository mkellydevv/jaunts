"""update trail table, add route table

Revision ID: 56a7af75aa4b
Revises: 83e7f127e1e4
Create Date: 2021-08-10 18:46:04.564609

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56a7af75aa4b'
down_revision = '83e7f127e1e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('routes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('trail_id', sa.Integer(), nullable=True),
    sa.Column('coordinates', sa.ARRAY(sa.Float()), nullable=False),
    sa.ForeignKeyConstraint(['trail_id'], ['trails.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('routes')
    # ### end Alembic commands ###