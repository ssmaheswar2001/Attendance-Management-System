import boto3
from botocore.exceptions import BotoCoreError, ClientError
import logging

import os
from dotenv import load_dotenv

# We want to load these from environment variables or config
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")  

# AWS S3 Client Setup
s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

def upload_file_to_s3(file_obj, key):
    # Upload a file like object to S3 bucekt under the given key

    try:
        s3_client.upload_fileobj(file_obj, AWS_S3_BUCKET_NAME, key)
        logging.info(f"Uploaded {key} to S3 bucket {AWS_S3_BUCKET_NAME}")
    except (BotoCoreError, ClientError) as e:
        logging.error(f"Failed to upload {key} to S3: {e}")
        raise