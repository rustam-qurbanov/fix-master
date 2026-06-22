from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import CurrentUser, require_master
from app.db import get_db
from app.models import MasterProfile, PortfolioItem
from app.schemas import PortfolioItemCreate, PortfolioItemOut

router = APIRouter(prefix="/masters/portfolio", tags=["portfolio"])


@router.post("", response_model=PortfolioItemOut)
def add_portfolio_item(
    payload: PortfolioItemCreate,
    current_user: CurrentUser = Depends(require_master),
    db: Session = Depends(get_db),
) -> PortfolioItem:
    profile = db.get(MasterProfile, current_user.id)
    if profile is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Create your master profile first"
        )

    item = PortfolioItem(
        master_id=current_user.id,
        image_url=payload.image_url,
        description=payload.description,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
