from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../.env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Validate required environment variables
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is required")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hashed(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # type: ignore

def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # type: ignore