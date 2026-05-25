from fastapi import APIRouter, HTTPException

from app.database import (
    visitors_collection,
    logs_collection
)

from bson import ObjectId

from datetime import datetime

import qrcode
import os
import smtplib

from email.message import EmailMessage

router = APIRouter()

# =========================================
# EMAIL CONFIG
# =========================================

EMAIL_ADDRESS = "companyguestpass@gmail.com"

EMAIL_PASSWORD = "nduf qqzh pgad rwwk"

# =========================================
# SEND EMAIL
# =========================================

def send_email(
    to_email,
    subject,
    body,
    attachment_path=None
):

    try:

        msg = EmailMessage()

        msg["Subject"] = subject
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email

        msg.set_content(body)

        if (
            attachment_path
            and
            os.path.exists(attachment_path)
        ):

            with open(
                attachment_path,
                "rb"
            ) as f:

                file_data = f.read()

            msg.add_attachment(
                file_data,
                maintype="image",
                subtype="png",
                filename="visitor_qr.png"
            )

        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465
        ) as smtp:

            smtp.login(
                EMAIL_ADDRESS,
                EMAIL_PASSWORD
            )

            smtp.send_message(msg)

        print("EMAIL SENT SUCCESSFULLY")

    except Exception as e:

        print("EMAIL ERROR:", e)

# =========================================
# CREATE VISITOR REQUEST
# =========================================

@router.post("/create-visitor-request")
async def create_visitor(visitor: dict):

    # =====================================
    # OFFICE TIMING VALIDATION
    # =====================================

    visit_time = visitor["visit_time"]

    hour = int(
        visit_time.split(":")[0]
    )

    minute = int(
        visit_time.split(":")[1]
    )

    total_minutes = (
        hour * 60
    ) + minute

    office_start = 9 * 60

    office_end = 18 * 60

    if (
        total_minutes < office_start
        or
        total_minutes > office_end
    ):

        raise HTTPException(

            status_code=400,

            detail=
            "Office timing is only between 9 AM and 6 PM"
        )

    # =====================================
    # ROOM CONFLICT
    # =====================================

    room_conflict = visitors_collection.find_one({

        "room_no":
        visitor["room_no"],

        "visit_date":
        visitor["visit_date"],

        "visit_time":
        visitor["visit_time"],

        "status": {
            "$in": [
                "approved",
                "checked_in",
                "pending"
            ]
        }
    })

    if room_conflict:

        raise HTTPException(

            status_code=400,

            detail=
            "Room already occupied at this time"
        )

    # =====================================
    # EMPLOYEE CONFLICT
    # =====================================

    employee_conflict = visitors_collection.find_one({

        "employee_name":
        visitor["employee_name"],

        "visit_date":
        visitor["visit_date"],

        "visit_time":
        visitor["visit_time"],

        "status": {
            "$in": [
                "approved",
                "checked_in",
                "pending"
            ]
        }
    })

    if employee_conflict:

        raise HTTPException(

            status_code=400,

            detail=
            "Employee already has another meeting at this time"
        )

    # =====================================
    # SAVE VISITOR
    # =====================================

    visitor["status"] = "pending"

    visitor["meeting_duration"] = "15 Minutes"

    visitor["office_timing"] = "9 AM to 6 PM"

    visitor["created_at"] = str(
        datetime.now()
    )

    result = visitors_collection.insert_one(
        visitor
    )

    return {

        "message":
        "Visitor Request Submitted Successfully",

        "visitor_id":
        str(result.inserted_id)
    }

# =========================================
# GET ALL VISITORS
# =========================================

@router.get("/all-visitor-requests")
async def get_all_visitors():

    visitors = []

    for visitor in visitors_collection.find():

        visitor["_id"] = str(
            visitor["_id"]
        )

        visitors.append(visitor)

    return visitors

# =========================================
# APPROVE VISITOR
# =========================================

@router.put("/approve-visitor/{visitor_id}")
async def approve_visitor(
    visitor_id: str
):

    visitor = visitors_collection.find_one({
        "_id": ObjectId(visitor_id)
    })

    if not visitor:

        raise HTTPException(
            status_code=404,
            detail="Visitor Not Found"
        )

    qr = qrcode.make(visitor_id)

    if not os.path.exists("qrcodes"):

        os.makedirs("qrcodes")

    qr_path = f"qrcodes/{visitor_id}.png"

    qr.save(qr_path)

    visitors_collection.update_one(

        {"_id": ObjectId(visitor_id)},

        {
            "$set": {

                "status": "approved",

                "qr_code": qr_path,

                "approved_at":
                str(datetime.now())
            }
        }
    )

    body = f"""
Hello {visitor['visitor_name']},

Your visitor request has been APPROVED.

====================================

Employee:
{visitor['employee_name']}

Department:
{visitor['department']}

Room Number:
{visitor['room_no']}

Visit Date:
{visitor['visit_date']}

Visit Time:
{visitor['visit_time']}

Meeting Duration:
15 Minutes

Office Timing:
9 AM to 6 PM

====================================

Important Instructions:

•Your visit is approved. 

•If you need to select another slot, please contact office administration at +91 7619370953.

• Carry your QR code

• Security verification mandatory

====================================

Thank You
Smart Visitor Management
"""

    send_email(
        visitor["visitor_email"],
        "Visitor Request Approved",
        body,
        qr_path
    )

    return {
        "message":
        "Visitor Approved Successfully"
    }

# =========================================
# REJECT VISITOR
# =========================================

@router.put("/reject-visitor/{visitor_id}")
async def reject_visitor(
    visitor_id: str
):

    visitor = visitors_collection.find_one({
        "_id": ObjectId(visitor_id)
    })

    if not visitor:

        raise HTTPException(
            status_code=404,
            detail="Visitor Not Found"
        )

    visitors_collection.update_one(

        {"_id": ObjectId(visitor_id)},

        {
            "$set": {

                "status": "rejected",

                "rejected_at":
                str(datetime.now())
            }
        }
    )

    body = f"""
Hello {visitor['visitor_name']},

Your visitor request has been REJECTED.

====================================

Possible Reasons:

• Employee unavailable

• Timing conflict

• Room occupied

Please select another slot. Alternatively, 
please contact office administration at +91 7619370953.

====================================

Thank You
Smart Visitor Management
"""

    send_email(
        visitor["visitor_email"],
        "Visitor Request Rejected",
        body
    )

    return {
        "message":
        "Visitor Rejected"
    }

# =========================================
# QR SCAN
# =========================================

@router.put("/scan-qr/{visitor_id}")
async def scan_qr(visitor_id: str):

    visitor = visitors_collection.find_one({
        "_id": ObjectId(visitor_id)
    })

    if not visitor:

        return {
            "message":
            "Visitor Not Found"
        }

    current_status = visitor["status"]

    current_time = datetime.now()

    # CHECK-IN

    if current_status == "approved":

        visitors_collection.update_one(

            {"_id": ObjectId(visitor_id)},

            {
                "$set": {

                    "status": "checked_in",

                    "check_in_time":
                    str(current_time)
                }
            }
        )

        logs_collection.insert_one({

            "visitor_id": visitor_id,

            "visitor_name":
            visitor.get("visitor_name"),

            "visitor_phone":
            visitor.get("visitor_phone"),

            "employee_name":
            visitor.get("employee_name"),

            "status": "checked_in",

            "date":
            str(current_time.date()),

            "time":
            str(current_time)
        })

        body = f"""
Hello {visitor['visitor_name']},

You have successfully CHECKED-IN.

Employee:
{visitor['employee_name']}

Room:
{visitor['room_no']}

Thank You
Smart Visitor Management
"""

        send_email(

            visitor["visitor_email"],

            "Visitor Checked-In",

            body
        )

        return {
            "message":
            "Visitor Checked-In"
        }

    # CHECK-OUT

    elif current_status == "checked_in":

        visitors_collection.update_one(

            {"_id": ObjectId(visitor_id)},

            {
                "$set": {

                    "status": "checked_out",

                    "check_out_time":
                    str(current_time)
                }
            }
        )

        logs_collection.insert_one({

            "visitor_id": visitor_id,

            "visitor_name":
            visitor.get("visitor_name"),

            "visitor_phone":
            visitor.get("visitor_phone"),

            "employee_name":
            visitor.get("employee_name"),

            "status": "checked_out",

            "date":
            str(current_time.date()),

            "time":
            str(current_time)
        })

        body = f"""
Hello {visitor['visitor_name']},

You have successfully CHECKED-OUT.

Thank you for visiting us.

Smart Visitor Management
"""

        send_email(

            visitor["visitor_email"],

            "Visitor Checked-Out",

            body
        )

        return {
            "message":
            "Visitor Checked-Out"
        }

    elif current_status == "checked_out":

        return {
            "message":
            "Visitor Already Checked-Out"
        }

    elif current_status == "pending":

        return {
            "message":
            "Visitor Approval Pending"
        }

    elif current_status == "rejected":

        return {
            "message":
            "Visitor Request Rejected"
        }

    return {
        "message":
        "Invalid QR"
    }

# =========================================
# SECURITY LOGS
# =========================================

@router.get("/security-logs")
async def security_logs():

    logs = []

    for log in logs_collection.find():

        log["_id"] = str(log["_id"])

        logs.append(log)

    return logs

# =========================================
# ROOM AVAILABILITY
# =========================================

@router.get("/room-availability")
async def room_availability():

    rooms = []

    for visitor in visitors_collection.find({

        "status": {
            "$in": [
                "approved",
                "checked_in"
            ]
        }
    }):

        visitor["_id"] = str(
            visitor["_id"]
        )

        rooms.append(visitor)

    return rooms