from app.utils.send_email import send_email
from fastapi import APIRouter, HTTPException
from bson import ObjectId

import qrcode
import os

from app.database import database
from app.schemas.visitor_schema import VisitorRequest

router = APIRouter()


# CREATE VISITOR REQUEST
@router.post("/create-visitor-request")
async def create_visitor_request(visitor: VisitorRequest):

    visitor_data = {
        "visitor_name": visitor.visitor_name,
        "visitor_email": visitor.visitor_email,
        "visitor_phone": visitor.visitor_phone,

        "employee_name": visitor.employee_name,

        "purpose": visitor.purpose,

        "visit_date": visitor.visit_date,
        "visit_time": visitor.visit_time,

        "status": "pending",

        "check_in": False,
        "check_out": False
    }

    await database.visitors.insert_one(visitor_data)

    return {
        "message": "Visitor Request Submitted Successfully"
    }


# GET ALL VISITOR REQUESTS
@router.get("/all-visitor-requests")
async def all_visitor_requests():

    visitors = []

    async for visitor in database.visitors.find():

        visitor["_id"] = str(visitor["_id"])

        visitors.append(visitor)

    return visitors


# APPROVE VISITOR + QR + EMAIL
@router.put("/approve-visitor/{visitor_id}")
async def approve_visitor(visitor_id: str):

    visitor = await database.visitors.find_one({
        "_id": ObjectId(visitor_id)
    })

    if not visitor:
        raise HTTPException(
            status_code=404,
            detail="Visitor Not Found"
        )

    # QR DATA
    qr_data = f"""
    Visitor ID: {visitor_id}
    Visitor Name: {visitor['visitor_name']}
    Employee: {visitor['employee_name']}
    Status: Approved
    """

    # GENERATE QR
    qr = qrcode.make(qr_data)

    os.makedirs("qrcodes", exist_ok=True)

    qr_path = f"qrcodes/{visitor_id}.png"

    qr.save(qr_path)

    # UPDATE DATABASE
    await database.visitors.update_one(
        {"_id": ObjectId(visitor_id)},
        {
            "$set": {
                "status": "approved",
                "qr_code": qr_path
            }
        }
    )

    # SEND EMAIL
    subject = "Visitor Request Approved"

    body = f"""
Hello {visitor['visitor_name']},

Your visitor request has been APPROVED.

Employee: {visitor['employee_name']}

Visit Date: {visitor['visit_date']}
Visit Time: {visitor['visit_time']}

Please carry your QR code during entry.

Thank You
Smart Visitor Management System
"""

    send_email(
    visitor["visitor_email"],
    subject,
    body,
    qr_path
)

    return {
        "message": "Visitor Approved, QR Generated & Email Sent",
        "qr_path": qr_path
    }

    # QR DATA
    qr_data = f"""
    Visitor ID: {visitor_id}
    Visitor Name: {visitor['visitor_name']}
    Employee: {visitor['employee_name']}
    Status: Approved
    """

    # GENERATE QR
    qr = qrcode.make(qr_data)

    # CREATE QR FOLDER
    os.makedirs("qrcodes", exist_ok=True)

    qr_path = f"qrcodes/{visitor_id}.png"

    # SAVE QR IMAGE
    qr.save(qr_path)

    # UPDATE DATABASE
    await database.visitors.update_one(
        {"_id": ObjectId(visitor_id)},
        {
            "$set": {
                "status": "approved",
                "qr_code": qr_path
            }
        }
    )

    return {
        "message": "Visitor Approved & QR Generated",
        "qr_path": qr_path
    }


# REJECT VISITOR
@router.put("/reject-visitor/{visitor_id}")
async def reject_visitor(visitor_id: str):

    result = await database.visitors.update_one(
        {"_id": ObjectId(visitor_id)},
        {
            "$set": {
                "status": "rejected"
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Visitor Request Not Found"
        )

    return {
        "message": "Visitor Request Rejected"
    }


# QR CHECK-IN / CHECK-OUT SYSTEM
@router.put("/scan-qr/{visitor_id}")
async def scan_qr(visitor_id: str):

    visitor = await database.visitors.find_one({
        "_id": ObjectId(visitor_id)
    })

    if not visitor:
        raise HTTPException(
            status_code=404,
            detail="Visitor Not Found"
        )

    # CHECK IF QR EXPIRED
    if visitor["status"] == "expired":
        return {
            "message": "QR Code Expired"
        }

    # FIRST SCAN → CHECK-IN
    if visitor["check_in"] is False:

        await database.visitors.update_one(
            {"_id": ObjectId(visitor_id)},
            {
                "$set": {
                    "check_in": True
                }
            }
        )

        return {
            "message": "Visitor Checked-In Successfully"
        }

    # SECOND SCAN → CHECK-OUT
    if visitor["check_in"] is True and visitor["check_out"] is False:

        await database.visitors.update_one(
            {"_id": ObjectId(visitor_id)},
            {
                "$set": {
                    "check_out": True,
                    "status": "expired"
                }
            }
        )

        return {
            "message": "Visitor Checked-Out Successfully"
        }

    return {
        "message": "QR Already Used"
    }