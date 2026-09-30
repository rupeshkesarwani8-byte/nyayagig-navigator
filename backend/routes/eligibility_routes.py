from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import WorkLog
from schemas import WorkLogCreate

router = APIRouter(prefix="/eligibility", tags=["Eligibility"])


@router.post("/log")
def add_log(data: WorkLogCreate, db: Session = Depends(get_db)):
    already = (
        db.query(WorkLog)
        .filter(
            WorkLog.phone == data.phone,
            WorkLog.platform == data.platform,
            WorkLog.work_date == data.work_date,
        )
        .first()
    )
    if already:
        if data.has_evidence and not already.has_evidence:
            already.has_evidence = True
            db.commit()
            return {"message": "Evidence added to this existing day"}
        return {"message": "This day was already saved"}

    log = WorkLog(
        phone=data.phone,
        platform=data.platform,
        work_date=data.work_date,
        has_evidence=data.has_evidence,
    )
    db.add(log)
    db.commit()
    return {"message": "Day saved successfully"}


@router.get("/{phone}")
def check_eligibility(phone: str, db: Session = Depends(get_db)):
    logs = db.query(WorkLog).filter(WorkLog.phone == phone).all()

    days_per_platform = {}
    for log in logs:
        days_per_platform[log.platform] = days_per_platform.get(log.platform, 0) + 1

    total_days = len({log.work_date for log in logs})
    best_single = max(days_per_platform.values(), default=0)
    evidence_count = len({log.work_date for log in logs if log.has_evidence})

    if best_single >= 90:
        eligible = True
        reason = "You have completed 90 days on a single platform"
    elif len(days_per_platform) > 1 and total_days >= 120:
        eligible = True
        reason = "You have completed 120 days across multiple platforms"
    else:
        eligible = False
        reason = "You have not yet completed the required eligibility period"

    return {
        "phone": phone,
        "days_per_platform": days_per_platform,
        "total_days": total_days,
        "evidence_backed_days": evidence_count,
        "self_declared_days": total_days - evidence_count,
        "eligible": eligible,
        "reason": reason,
        "days_left_single_platform": max(0, 90 - best_single),
        "days_left_multi_platform": max(0, 120 - total_days),
    }