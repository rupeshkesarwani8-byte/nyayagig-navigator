from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db
from models import User
from schemas import SignupCreate, LoginCreate

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/signup")
def signup(data: SignupCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Is phone number se pehle se account bana hua hai")

    hashed = pwd_context.hash(data.password)
    user = User(name=data.name, phone=data.phone, hashed_password=hashed)
    db.add(user)
    db.commit()

    return {"message": "Account ban gaya", "name": user.name, "phone": user.phone}


@router.post("/login")
def login(data: LoginCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Phone number ya password galat hai")

    user.last_login = datetime.utcnow()
    db.commit()

    return {
        "message": "Login safal raha",
        "name": user.name,
        "phone": user.phone,
        "last_login": user.last_login.isoformat(),
    }