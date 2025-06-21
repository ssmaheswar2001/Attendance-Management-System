from sqlalchemy import Column, String, Date, Time, ForeignKey
from app.core.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(10), primary_key=True)
    user_id = Column(String(10), ForeignKey("users.id"))
    punch_date = Column(Date)
    punch_time = Column(Time)
