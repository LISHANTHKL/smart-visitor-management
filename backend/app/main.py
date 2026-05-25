from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.visitor import router as visitor_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visitor_router)

@app.get("/")
def home():
    return {
        "message": "Smart Visitor Backend Running"
    }

@app.get("/healthz")
def health():
    return {
        "status": "ok"
    }