"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-21
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True),
    )

    op.create_table(
        "master_profiles",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            primary_key=True,
        ),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("price_from", sa.Integer(), nullable=False),
        sa.Column("price_to", sa.Integer(), nullable=False),
        sa.Column("experience_years", sa.Integer(), nullable=True),
        sa.Column("avatar_url", sa.String(), nullable=True),
        sa.Column("whatsapp", sa.String(), nullable=True),
        sa.Column("telegram", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "master_categories",
        sa.Column(
            "master_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("master_profiles.user_id"),
            primary_key=True,
        ),
        sa.Column(
            "category_id", sa.Integer(), sa.ForeignKey("categories.id"), primary_key=True
        ),
        sa.UniqueConstraint("master_id", "category_id"),
    )

    op.create_table(
        "portfolio_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "master_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("master_profiles.user_id"),
            nullable=False,
        ),
        sa.Column("image_url", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
    )

    op.bulk_insert(
        sa.table(
            "categories",
            sa.column("id", sa.Integer()),
            sa.column("name", sa.String()),
        ),
        [
            {"id": 1, "name": "Сантехника"},
            {"id": 2, "name": "Электрика"},
            {"id": 3, "name": "Ремонт квартир"},
            {"id": 4, "name": "Стройка"},
            {"id": 5, "name": "Отопление"},
            {"id": 6, "name": "Газ"},
        ],
    )


def downgrade() -> None:
    op.drop_table("portfolio_items")
    op.drop_table("master_categories")
    op.drop_table("master_profiles")
    op.drop_table("categories")
    op.drop_table("users")
