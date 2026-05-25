from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.visitor import router as visitor_router

# =========================================