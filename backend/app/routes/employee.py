from fastapi import APIRouter
from app.database import db

router = APIRouter()

employees_collection = db["employees"]

# ==========================
# ADD EMPLOYEE
# ==========================

@router.post("/add-employee")
async def add_employee(employee: dict):

    employees_collection.insert_one(employee)

    return {
        "message": "Employee Added Successfully"
    }

# ==========================
# GET EMPLOYEES
# ==========================

@router.get("/employees")
async def get_employees():

    employees = []

    for employee in employees_collection.find():

        employee["_id"] = str(employee["_id"])

        employees.append(employee)

    return employees