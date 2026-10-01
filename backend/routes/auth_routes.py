from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db
from models import User
from schemas import SignupCreate, LoginCreate, ProfileUpdate

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/signup")
def signup(data: SignupCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this phone number already exists")

    hashed = pwd_context.hash(data.password)
    user = User(name=data.name, phone=data.phone, hashed_password=hashed)
    db.add(user)
    db.commit()

    return {"message": "Account created", "name": user.name, "phone": user.phone}


@router.post("/login")
def login(data: LoginCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect phone number or password")

    user.last_login = datetime.utcnow()
    db.commit()

    return {
        "message": "Login successful",
        "name": user.name,
        "phone": user.phone,
        "last_login": user.last_login.isoformat(),
    }


@router.get("/profile/{phone}")
def get_profile(phone: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user.name,
        "phone": user.phone,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }


@router.put("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(data.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    user.name = data.name
    if data.new_password:
        user.hashed_password = pwd_context.hash(data.new_password)

    db.commit()

    return {"message": "Profile updated successfully", "name": user.name, "phone": user.phone}