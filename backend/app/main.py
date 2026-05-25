from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.visitor import router as visitor_router
from app.routes.employee import router as employee_router

app = FastAPI()

# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Routes ---------------- #

app.include_router(auth_router)
app.include_router(visitor_router)
app.include_router(employee_router)

# ---------------- Home ---------------- #

@app.get("/")
def home():
    return {
        "message": "Smart Visitor Management System API Running"
    }