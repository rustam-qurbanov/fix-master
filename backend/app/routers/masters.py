from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.auth import CurrentUser, require_master
from app.db import get_db
from app.models import Category, MasterProfile
from app.schemas import MasterProfileCard, MasterProfileOut, MasterProfileUpsert

router = APIRouter(prefix="/masters", tags=["masters"])


def _base_query():
    return select(MasterProfile).options(
        selectinload(MasterProfile.categories),
        selectinload(MasterProfile.portfolio_items),
    )


@router.get("", response_model=list[MasterProfileCard])
def search_masters(
    category: int | None = None,
    city: str | None = None,
    price_min: int | None = None,
    price_max: int | None = None,
    db: Session = Depends(get_db),
) -> list[MasterProfile]:
    query = _base_query()
    if category is not None:
        query = query.join(MasterProfile.categories).where(Category.id == category)
    if city is not None:
        query = query.where(MasterProfile.city.ilike(city))
    if price_min is not None:
        query = query.where(MasterProfile.price_to >= price_min)
    if price_max is not None:
        query = query.where(MasterProfile.price_from <= price_max)
    return list(db.scalars(query).unique())


@router.get("/{master_id}", response_model=MasterProfileOut)
def get_master(master_id: str, db: Session = Depends(get_db)) -> MasterProfile:
    profile = db.scalar(_base_query().where(MasterProfile.user_id == master_id))
    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Master not found")
    return profile


@router.put("/profile", response_model=MasterProfileOut)
def upsert_profile(
    payload: MasterProfileUpsert,
    current_user: CurrentUser = Depends(require_master),
    db: Session = Depends(get_db),
) -> MasterProfile:
    profile = db.get(MasterProfile, current_user.id)
    if profile is None:
        profile = MasterProfile(user_id=current_user.id)
        db.add(profile)

    profile.full_name = payload.full_name
    profile.bio = payload.bio
    profile.city = payload.city
    profile.price_from = payload.price_from
    profile.price_to = payload.price_to
    profile.experience_years = payload.experience_years
    profile.avatar_url = payload.avatar_url
    profile.whatsapp = payload.whatsapp
    profile.telegram = payload.telegram

    if payload.category_ids:
        profile.categories = list(
            db.scalars(select(Category).where(Category.id.in_(payload.category_ids)))
        )
    else:
        profile.categories = []

    db.commit()
    db.refresh(profile)
    return profile
