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
        "authority": "Karnataka Gig Workers Welfare Board (IPGRS Portal)",
        "contact": "080-22253911",
        "website": "https://sevasindhugs.karnataka.gov.in",
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

        "west_bengal": {
        "label": "West Bengal",
        "authority": "West Bengal Labour Department",
        "contact": "033-22625962",
        "website": "https://wblc.gov.in",
    },
    "tamil_nadu": {
        "label": "Tamil Nadu",
        "authority": "Tamil Nadu Labour Welfare Board",
        "contact": "044-28511323",
        "website": "https://labour.tn.gov.in",
    },
    "telangana": {
        "label": "Telangana",
        "authority": "Telangana Labour Department",
        "contact": "040-23237462",
        "website": "https://labour.telangana.gov.in",
    },
    "gujarat": {
        "label": "Gujarat",
        "authority": "Gujarat Labour and Employment Department",
        "contact": "079-23251163",
        "website": "https://labour.gujarat.gov.in",
    },
    "rajasthan": {
        "label": "Rajasthan",
        "authority": "Rajasthan Labour Department",
        "contact": "0141-2227864",
        "website": "https://labour.rajasthan.gov.in",
    },
    "punjab": {
        "label": "Punjab",
        "authority": "Punjab Labour Department",
        "contact": "0172-2740768",
        "website": "https://pblabour.gov.in",
    },
    
    "other": {
        "label": "Other State",
        "authority": "Your State's Labour Commissioner Office",
        "contact": "Check your state's labour department website",
        "website": "https://labour.gov.in",
    },
}

# Problem type ke hisaab se extra guidance
PROBLEM_GUIDANCE = {
    "deactivation": {
        "label": "No response to deactivation appeal",
        "steps": [
            "Keep your generated appeal letter and its proof (screenshot/email) ready",
            "File a written complaint with the relevant authority, attaching a copy of your appeal letter",
            "In Karnataka, file directly on the IPGRS portal — complaints are automatically routed to the Internal Dispute Resolution Committee (IDRC) with a time-bound resolution",
            "If no response within 15 days, escalate to the Labour Commissioner",
        ],
    },
    "payment": {
        "label": "Payment not received",
        "steps": [
            "Collect all your payment records/screenshots",
            "First file a complaint with the platform's grievance cell",
            "If unresolved, file a complaint with the Labour Welfare Board",
        ],
    },
    "benefits": {
        "label": "Social security benefit not received",
        "steps": [
            "Keep your eligibility record (from the Dashboard) ready",
            "Register/apply with your state's Welfare Board",
            "Save your application number for future reference",
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