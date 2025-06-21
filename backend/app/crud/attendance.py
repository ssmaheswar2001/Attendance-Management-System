import re
from sqlalchemy.orm import Session
from datetime import datetime, date
from app.models.attendance import Attendance

def has_punched_today(db: Session, user_id: str):
    today = date.today()
    return db.query(Attendance).filter(
        Attendance.user_id == user_id,
        Attendance.punch_date == today
    ).first()

def generate_attendance_id(db: Session) -> str:
    # Get the highest user ID
    last_attendance = db.query(Attendance).order_by(Attendance.id.desc()).first()
    if last_attendance and re.match(r"A\d{6}", last_attendance.id):
        # Extract the numeric part and increment
        last_id_num = int(last_attendance.id[1:])
        new_id_num = last_id_num + 1
    else:
        # If no user found, start from 1
        new_id_num = 1
    return f"A{str(new_id_num).zfill(6)}"

def punch_attendance(db: Session, user_id: str):
    now = datetime.now()
    # attendance_id = "A" + str(uuid.uuid4().hex[:7]).upper()
    attendance_id = generate_attendance_id(db)
    new_attendance = Attendance(
        id=attendance_id,
        user_id=user_id,
        punch_date=now.date(),
        punch_time=now.time()
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance
