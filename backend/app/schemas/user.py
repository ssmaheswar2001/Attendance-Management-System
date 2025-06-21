from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    roll_no: str
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    roll_no: str
    email: str
    profile_pic:  Optional[str] = None
    is_admin: bool

    class Config:
        orm_mode = True

class UpdateUser(BaseModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    email: Optional[str] = None