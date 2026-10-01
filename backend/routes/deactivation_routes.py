from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import WorkLog, DeactivationCase
from schemas import DeactivationCreate

router = APIRouter(prefix="/deactivation", tags=["Deactivation"])

# Keyword se reason pehchanne ki simple list
KEYWORD_REASONS = [
    (["rating", "star"], "rating_drop", "Rating kam hone ki wajah se account block hua lagta hai"),
    (["cancel"], "cancellation_rate", "Zyada order cancel karne ki wajah se account block hua lagta hai"),
    (["fraud", "fake", "suspicious"], "fraud_flag", "Fraud ya suspicious activity ka shak jataya gaya hai"),
    (["complaint", "customer", "rude", "behaviour", "behavior"], "customer_complaint", "Customer complaint ki wajah se action liya gaya"),
    (["policy violation", "violation", "policy"], "policy_violation", "General policy violation bataya gaya hai, specific reason clear nahi hai"),
    (["late", "delay"], "delivery_delay", "Delivery me deri hone ki wajah se action liya gaya"),
]

# Har state/central law ki basic detail
LAWS = {
    "central": {
        "law_name": "Code on Social Security, 2020 (Rules 2026)",
        "section": "Gig worker welfare pravdhan",
        "requirement": "Platform ko worker ke grievance ka nivaran karna zaroori hai.",
    },
    "karnataka": {
        "law_name": "Karnataka Platform-Based Gig Workers Act, 2025",
        "section": "Section 13",
        "requirement": "Platform ko simple bhasha me deactivation ka reason dena zaroori hai.",
    },
}


def classify_notice(text: str):
    lowered = text.lower()
    for keywords, code, reason in KEYWORD_REASONS:
        for kw in keywords:
            if kw in lowered:
                return code, reason
    return "unknown", "Notice me specific reason clearly nahi mila. Manual review zaroori hai."


def generate_letter(name, phone, platform, reason_text, state, days_worked):
    law = LAWS.get(state, LAWS["central"])
    worker_name = name if name else "Ek Gig Worker"

    letter = f"""Vishay: Account Deactivation ke khilaaf Appeal

Sevam,
{platform} Grievance Cell,

Mera naam {worker_name} hai (Phone: {phone}), aur main {platform} platform par gig worker ke roop me kaam karta hoon.

Mera account is wajah se deactivate kiya gaya hai: "{reason_text}". Main is faisle se sahmat nahi hoon aur nimnlikhit binduon par apna paksh rakhna chahta hoon:

1. Maine ab tak {days_worked} din is platform par kaam kiya hai, jiska record mere paas maujood hai.
2. Mujhe deactivation ka poora evidence (jaise specific complaint, GPS log) nahi dikhaya gaya hai.
3. {law['law_name']} ({law['section']}) ke tehat, {law['requirement']}

Ataha, main anurodh karta hoon ki:
- Mera account turant review kiya jaaye
- Deactivation ka poora evidence mujhe dikhaya jaaye
- Agar koi galti hui hai, use sudharne ka mauka diya jaaye

Dhanyavaad,
{worker_name}
Phone: {phone}"""

    return letter


@router.post("/analyze")
def analyze_notice(data: DeactivationCreate, db: Session = Depends(get_db)):
    code, reason_text = classify_notice(data.notice_text)

    days_worked = (
        db.query(WorkLog)
        .filter(WorkLog.phone == data.phone, WorkLog.platform == data.platform)
        .count()
    )

    letter = generate_letter(
        name=data.name,
        phone=data.phone,
        platform=data.platform,
        reason_text=reason_text,
        state=data.state,
        days_worked=days_worked,
    )

    case = DeactivationCase(
        phone=data.phone,
        platform=data.platform,
        notice_text=data.notice_text,
        detected_reason=code,
        generated_letter=letter,
    )
    db.add(case)
    db.commit()

    return {
        "detected_reason_code": code,
        "detected_reason_text": reason_text,
        "law_used": LAWS.get(data.state, LAWS["central"]),
        "days_worked_logged": days_worked,
        "generated_letter": letter,
    }


@router.get("/history/{phone}")
def get_history(phone: str, db: Session = Depends(get_db)):
    cases = (
        db.query(DeactivationCase)
        .filter(DeactivationCase.phone == phone)
        .order_by(DeactivationCase.id.desc())
        .all()
    )

    return [
        {
            "id": case.id,
            "platform": case.platform,
            "notice_text": case.notice_text,
            "detected_reason": case.detected_reason,
            "generated_letter": case.generated_letter,
        }
        for case in cases
    ]