import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(String, nullable=False)  # "client" | "master"
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    master_profile: Mapped["MasterProfile"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class MasterProfile(Base):
    __tablename__ = "master_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=False)
    price_from: Mapped[int] = mapped_column(nullable=False)
    price_to: Mapped[int] = mapped_column(nullable=False)
    experience_years: Mapped[int | None] = mapped_column(nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String, nullable=True)
    telegram: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="master_profile")
    categories: Mapped[list["Category"]] = relationship(
        secondary="master_categories", back_populates="masters"
    )
    portfolio_items: Mapped[list["PortfolioItem"]] = relationship(
        back_populates="master", cascade="all, delete-orphan"
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    masters: Mapped[list["MasterProfile"]] = relationship(
        secondary="master_categories", back_populates="categories"
    )


class MasterCategory(Base):
    __tablename__ = "master_categories"
    __table_args__ = (UniqueConstraint("master_id", "category_id"),)

    master_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("master_profiles.user_id"), primary_key=True
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), primary_key=True
    )


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    master_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("master_profiles.user_id"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    master: Mapped["MasterProfile"] = relationship(back_populates="portfolio_items")
