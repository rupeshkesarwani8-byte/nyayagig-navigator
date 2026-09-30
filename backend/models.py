from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WorkLog(Base):
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True)
    platform = Column(String)
    work_date = Column(Date)
    has_evidence = Column(Boolean, default=False)


class DeactivationCase(Base):
    __tablename__ = "deactivation_cases"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True)
    platform = Column(String)
    notice_text = Column(String)
    detected_reason = Column(String)
    generated_letter = Column(String)