from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

from app.database import database
from app.schemas.user_schema import UserRegister, UserLogin

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# REGISTER USER
@router.post("/register")
async def register(user: UserRegister):

    existing_user = await database.users.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    await database.users.insert_one(user_data)

    return {
        "message": "User Registered Successfully"
    }


# LOGIN USER
@router.post("/login")
async def login(user: UserLogin):

    db_user = await database.users.find_one({
        "email": user.email
    })

    # CHECK EMAIL
    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid Email"
        )

    # VERIFY PASSWORD
    password_correct = pwd_context.verify(
        user.password,
        db_user["password"]
    )

    if not password_correct:
        raise HTTPException(
            status_code=400,
            detail="Invalid Password"
        )

    return {
        "message": "Login Successful",
        "user": {
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        }
    }