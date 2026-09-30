from datetime import date
from typing import Optional
from pydantic import BaseModel


class WorkLogCreate(BaseModel):
    phone: str
    platform: str
    work_date: date


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