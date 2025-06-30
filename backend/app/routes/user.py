from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from typing import List 
import os
import shutil
from pathlib import Path
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut, UpdateUser
from app.schemas.token import Token, LoginRequest
from app.auth.auth_handler import create_access_token
from app.auth.auth_bearer import get_current_user
from app.utils.email_utils import send_registration_email
from app.utils.s3_utils import upload_file_to_s3
from app.crud.user import create_user, authenticate_user
from app.core.database import get_db
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    existing_roll = db.query(User).filter(User.roll_no == user.roll_no).first()
    if existing_roll:
        raise HTTPException(status_code=400, detail="Roll number already in use")
    new_user = create_user(db=db, user=user)
    # Send email in background
    background_tasks.add_task(send_registration_email, str(new_user.id), user.email, user.name, user.roll_no)
    return new_user

@router.post("/register-with-face", response_model=UserOut)
def register_with_face(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    name: str = Form(...),
    roll_no: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    files: List[UploadFile] = File(...)
    
):
    user = UserCreate(name=name, roll_no=roll_no, email=email, password=password)
    if len(files) < 24:
        raise HTTPException(status_code=400, detail="Please Upload at least 25 face images")
    
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.roll_no == user.roll_no).first():
        raise HTTPException(status_code=400, detail="Roll number already in use")

    new_user = create_user(db=db, user=user)

    for i, file in enumerate(files):
        if not file.content_type or not file.content_type.startswith("image/"):
            db.delete(new_user)
            db.commit()
            raise HTTPException(status_code=400, detail="Non-image file uploaded")
        # Reset file pointer
        file.file.seek(0)
        # Define S3 key (folder structure inside the bucket)
        s3_key = f"user_faces/{new_user.id}/img{i+1}.jpg"

        try:
            upload_file_to_s3(file.file, s3_key)
        except Exception as e:
            db.delete(new_user)
            db.commit()
            raise HTTPException(status_code=500, detail="Failed to upload image to S3.")

    # Send email in background
    background_tasks.add_task(send_registration_email, str(new_user.id), str(new_user.email), str(new_user.name), str(new_user.roll_no))

    return new_user


@router.post("/login", response_model=Token)
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    token_data = {
        "sub": user.id,
        "is_admin": user.is_admin,
        "username": user.name
    }
    token = create_access_token(data=token_data)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/upload-profile-pic")
def upload_profile_pic(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    ext = file.filename.split(".")[-1]
    filename = f"{str(current_user.id)}.{ext}"
    filepath = f"app/static/profile_pics/{filename}"
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.profile_pic = f"/static/profile_pics/{filename}"  # type: ignore
    db.commit()
    db.refresh(current_user)

    return {"profile_pic_url": current_user.profile_pic}


@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    return current_user

@router.patch("/me", response_model=UserOut)
def update_user_Details(update: UpdateUser, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    if update.name:
        current_user.name = update.name  # type: ignore
    if update.roll_no:
        current_user.roll_no = update.roll_no  # type: ignore
    if update.email:
        current_user.email = update.email  # type: ignore
    db.commit()
    db.refresh(current_user)
    return current_user