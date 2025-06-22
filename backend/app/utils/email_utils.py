# app/utils/email_utils.py
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

def send_registration_email(id: str, to_email: str, name: str, roll_no: str):
    email_sender = os.getenv("EMAIL_USERNAME")
    email_password = os.getenv("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg['Subject'] = 'Registration Successful'
    msg['From'] = email_sender
    msg['To'] = to_email

    msg.set_content(f"""
    Hello {name},

    You have successfully registered to AI Attendance Management System with:
    - Id: {id}
    - Name: {name}
    - Email: {to_email}
    - Roll No: {roll_no}

    Welcome aboard!
    """)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(email_sender, email_password)
        smtp.send_message(msg)
