from fastapi import FastAPI
# from routes import user, attendance, admin
from app.routes import user, attendance, admin
from app.core.database import Base, engine
# from core.database import Base, engine
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

# CORS settings - allow both HTTP and HTTPS for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "http://attendance-app.com",  # Production HTTP
        "https://attendance-app.com",  # Production HTTPS
        "http://www.attendance-app.com",  # Production HTTP with www
        "https://www.attendance-app.com",  # Production HTTPS with www
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(attendance.router)
app.include_router(admin.router)