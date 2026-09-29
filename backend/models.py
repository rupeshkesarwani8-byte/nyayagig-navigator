from sqlalchemy import Column, Integer, String, Date
from database import Base


class WorkLog(Base):
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True)
    platform = Column(String)
    work_date = Column(Date)


class DeactivationCase(Base):
    __tablename__ = "deactivation_cases"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True)
    platform = Column(String)
    notice_text = Column(String)
    detected_reason = Column(String)
    generated_letter = Column(String)