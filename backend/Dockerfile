FROM python:3.10-slim

WORKDIR /app

COPY ./app /app/app 

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Add wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 8000

# Wait for MySQL before starting Uvicorn
# CMD ["/wait-for-it.sh", "db:3306", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]