import re
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth.auth_handler import get_password_hashed, verify_password


def generate_user_id(db: Session) -> str:
    # Get the highest user ID
    last_user = db.query(User).order_by(User.id.desc()).first()
    if last_user and re.match(r"U\d{4}", str(last_user.id)):
        # Extract the numeric part and increment
        last_id_num = int(str(last_user.id)[1:])
        new_id_num = last_id_num + 1
    else:
        # If no user found, start from 1
        new_id_num = 1
    return f"U{str(new_id_num).zfill(4)}"


def create_user(db: Session, user: UserCreate):
    uid = generate_user_id(db)
    hashed_password = get_password_hashed(user.password)

    db_user = User(
        id = uid,
        name = user.name,
        roll_no = user.roll_no,
        email = user.email,
        password = hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user
