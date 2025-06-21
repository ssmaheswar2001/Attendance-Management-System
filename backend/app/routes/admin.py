from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from datetime import date
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.auth_bearer import get_current_user
from app.models.user import User
from app.models.attendance import Attendance
from app.schemas.user import UserOut
from app.schemas.attendance import AttendanceResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

# Ensure only admin can access
def require_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin Privileges Required")
    return current_user

@router.get("/users", response_model=list[UserOut])
def list_all_users(
    name: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)):
    
    query = db.query(User)

    if name:
        query = query.filter(User.name.ilike(f"%{name}%"))
    if email:
        query = query.filter(User.email.ilike(f"%{email}%"))

    return query.order_by(User.roll_no).all()

@router.get("/attendance", response_model=list[AttendanceResponse])
def list_all_attendance(
    user_id: Optional[str] = Query(None),
    punch_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
): 
    query = db.query(Attendance)

    if user_id:
        query = query.filter(Attendance.user_id == user_id)
    if punch_date:
        query = query.filter(Attendance.punch_date == punch_date)

    return query.order_by(Attendance.punch_date.desc(), Attendance.id).all()