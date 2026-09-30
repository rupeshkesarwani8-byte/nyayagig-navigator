from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from routes import eligibility_routes, deactivation_routes, escalation_routes, auth_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NyayaGig Navigator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(eligibility_routes.router)
app.include_router(deactivation_routes.router)
app.include_router(escalation_routes.router)


@app.get("/")
def home():
    return {"message": "NyayaGig Navigator backend chal raha hai"}