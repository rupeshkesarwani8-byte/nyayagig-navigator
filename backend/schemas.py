from datetime import date
from typing import Optional
from pydantic import BaseModel


class WorkLogCreate(BaseModel):
    phone: str
    platform: str
    work_date: date
    has_evidence: bool = False
    earnings: float = 0.0


class DeactivationCreate(BaseModel):
    name: Optional[str] = None
    phone: str
    platform: str
    state: str = "central"
    notice_text: str


class SignupCreate(BaseModel):
    name: str
    phone: str
    password: str


class LoginCreate(BaseModel):
    phone: str
    password: str


class ProfileUpdate(BaseModel):
    phone: str
    name: str
    current_password: str
    new_password: Optional[str] = None