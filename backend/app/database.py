from pymongo import MongoClient

# =========================================
# MONGODB CONNECTION
# =========================================

client = MongoClient(
    "mongodb://localhost:27017"
)

db = client["smart_visitor_db"]

# =========================================
# COLLECTIONS
# =========================================

users_collection = db["users"]

visitors_collection = db["visitors"]

logs_collection = db["security_logs"]

employees_collection = db["employees"]

print("MongoDB Connected Successfully")