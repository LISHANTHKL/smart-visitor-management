from pydantic import BaseModel, EmailStr

class VisitorRequest(BaseModel):

    visitor_name: str
    visitor_email: EmailStr
    visitor_phone: str

    employee_name: str

    purpose: str

    visit_date: str
    visit_time: str