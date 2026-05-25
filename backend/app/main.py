from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.visitor import router as visitor_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(visitor_router)

# TEST ROUTE
@app.get("/")
def home():
    return {
        "message": "Smart Visitor Management Backend Running"
    }

# HEALTH CHECK
@app.get("/healthz")
def health():
    return {
        "status": "ok"
    }