from fastapi import APIRouter

router = APIRouter(prefix="/escalation", tags=["Escalation"])

# State ke hisaab se authority ka data
STATE_AUTHORITIES = {
    "uttar_pradesh": {
        "label": "Uttar Pradesh",
        "authority": "UP State Labour Welfare Board",
        "contact": "0522-2286640",
        "website": "https://uplabour.gov.in",
    },
    "karnataka": {
        "label": "Karnataka",
        "authority": "Karnataka Gig Workers Welfare Board",
        "contact": "080-22253911",
        "website": "https://labour.karnataka.gov.in",
    },
    "maharashtra": {
        "label": "Maharashtra",
        "authority": "Maharashtra Labour Welfare Board",
        "contact": "022-24102855",
        "website": "https://mahakamgar.gov.in",
    },
    "delhi": {
        "label": "Delhi",
        "authority": "Delhi Labour Department",
        "contact": "011-23890039",
        "website": "https://labour.delhi.gov.in",
    },
    "other": {
        "label": "Anya Rajya",
        "authority": "Apne Rajya ka Labour Commissioner Office",
        "contact": "Apne rajya ke labour department ki website dekhein",
        "website": "https://labour.gov.in",
    },
}

# Problem type ke hisaab se extra guidance
PROBLEM_GUIDANCE = {
    "deactivation": {
        "label": "Deactivation ka jawab nahi mila",
        "steps": [
            "Apna generated appeal letter aur uska proof (screenshot/email) saath rakhein",
            "Sambandhit authority ko likhit shikayat dein, appeal letter ki copy ke saath",
            "Agar 15 din me jawab na mile, toh Labour Commissioner ke paas jaayein",
        ],
    },
    "payment": {
        "label": "Payment nahi mila",
        "steps": [
            "Apne saare payment records/screenshots ikattha karein",
            "Pehle platform ke grievance cell me complaint karein",
            "Jawab na mile toh Labour Welfare Board me shikayat darj karein",
        ],
    },
    "benefits": {
        "label": "Social Security Benefit (insurance/pension) nahi mila",
        "steps": [
            "Apna eligibility record (Module 1 wala) saath rakhein",
            "Apne rajya ke Welfare Board me registration/application karein",
            "Application number save karke rakhein future reference ke liye",
        ],
    },
}


@router.get("/states")
def get_states():
    return [{"value": k, "label": v["label"]} for k, v in STATE_AUTHORITIES.items()]


@router.get("/problems")
def get_problems():
    return [{"value": k, "label": v["label"]} for k, v in PROBLEM_GUIDANCE.items()]


@router.get("/guide")
def get_guide(state: str, problem: str):
    state_data = STATE_AUTHORITIES.get(state, STATE_AUTHORITIES["other"])
    problem_data = PROBLEM_GUIDANCE.get(problem, PROBLEM_GUIDANCE["deactivation"])

    return {
        "state_label": state_data["label"],
        "authority": state_data["authority"],
        "contact": state_data["contact"],
        "website": state_data["website"],
        "problem_label": problem_data["label"],
        "steps": problem_data["steps"],
    }