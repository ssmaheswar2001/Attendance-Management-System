from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.attendance import AttendanceResponse
from app.models.attendance import Attendance
from app.auth.auth_bearer import get_current_user
from app.core.database import get_db
from app.crud.attendance import has_punched_today, punch_attendance
from app.models.user import User

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/punch", response_model=AttendanceResponse)
def punch(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if has_punched_today(db, current_user.id):
        raise HTTPException(status_code=400, detail="Already punched today.")
    return punch_attendance(db, current_user.id)

@router.get("/history", response_model=list[AttendanceResponse])
def get_attendance_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(Attendance).filter(Attendance.user_id == current_user.id).order_by(Attendance.punch_date.desc()).all()
    return records