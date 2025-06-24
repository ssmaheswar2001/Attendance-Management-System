from pydantic import BaseModel
from datetime import date, time

class AttendanceResponse(BaseModel):
    id: str
    user_id: str
    punch_date: date
    punch_time: time

    class Config:
        from_attributes = True
