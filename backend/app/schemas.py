import uuid

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class PortfolioItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str
    description: str | None = None


class PortfolioItemCreate(BaseModel):
    image_url: str
    description: str | None = None


class MasterProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    full_name: str
    bio: str | None = None
    city: str
    price_from: int
    price_to: int
    experience_years: int | None = None
    avatar_url: str | None = None
    whatsapp: str | None = None
    telegram: str | None = None
    categories: list[CategoryOut] = []
    portfolio_items: list[PortfolioItemOut] = []


class MasterProfileCard(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    full_name: str
    city: str
    price_from: int
    price_to: int
    avatar_url: str | None = None
    categories: list[CategoryOut] = []


class MasterProfileUpsert(BaseModel):
    full_name: str
    bio: str | None = None
    city: str
    price_from: int
    price_to: int
    experience_years: int | None = None
    avatar_url: str | None = None
    whatsapp: str | None = None
    telegram: str | None = None
    category_ids: list[int] = []
