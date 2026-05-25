from fastapi import APIRouter, HTTPException
from app.database import db
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------- REGISTER ---------------- #

@router.post("/register")
def register(user: dict):

    existing_user = db.users.find_one({
        "email": user["email"]
    })

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user["password"])

    user_data = {
        "name": user["name"],
        "email": user["email"],
        "password": hashed_password,
        "role": user["role"]
    }

    db.users.insert_one(user_data)

    return {
        "message": "User Registered Successfully"
    }

# ---------------- LOGIN ---------------- #

@router.post("/login")
def login(user: dict):

    existing_user = db.users.find_one({
        "email": user["email"]
    })

    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid Email")

    password_match = pwd_context.verify(
        user["password"],
        existing_user["password"]
    )

    if not password_match:
        raise HTTPException(status_code=400, detail="Invalid Password")

    return {
        "message": "Login Successful",
        "user": {
            "name": existing_user["name"],
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    }