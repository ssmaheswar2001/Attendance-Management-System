from sqlalchemy import Column, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(10), primary_key=True, index=True)
    name = Column(String(100))
    roll_no = Column(String(20), unique=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    profile_pic = Column(String(255), default="")
    is_admin = Column(Boolean, default=False) 
