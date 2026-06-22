import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str  # "client" | "master"
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: uuid.UUID
    role: str


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    if payload.role not in ("client", "master"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "role must be client or master")

    resp = httpx.post(
        f"{settings.supabase_url}/auth/v1/signup",
        json={"email": payload.email, "password": payload.password},
        headers={"apikey": settings.supabase_service_key},
        timeout=10,
    )
    if resp.status_code >= 400:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, resp.json().get("msg", "Signup failed"))
    data = resp.json()
    user_id = uuid.UUID(data["user"]["id"])

    db.add(User(id=user_id, email=payload.email, phone=payload.phone, role=payload.role))
    db.commit()

    return AuthResponse(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        user_id=user_id,
        role=payload.role,
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    resp = httpx.post(
        f"{settings.supabase_url}/auth/v1/token?grant_type=password",
        json={"email": payload.email, "password": payload.password},
        headers={"apikey": settings.supabase_service_key},
        timeout=10,
    )
    if resp.status_code >= 400:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    data = resp.json()
    user_id = uuid.UUID(data["user"]["id"])

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User record not found")

    return AuthResponse(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        user_id=user_id,
        role=user.role,
    )
