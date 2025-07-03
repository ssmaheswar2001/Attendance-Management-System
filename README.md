# Attendance Management System using Computer Vision & RAG Text-to-SQL chatbot

A modern attendance management solution leveraging AI for secure, efficient, and user-friendly attendance tracking. The system features a web-based React frontend, a robust FastAPI backend, and is designed for easy deployment and future extensibility.

---

## Features

- **User Authentication:** Secure login and registration for users and admins.
- **Attendance Punch In/Out:** Users can mark attendance via the web interface using Yolo-Face & ResNet-100 
- **Admin Dashboard:** Manage users, view attendance logs, and generate reports.
- **Profile Management:** Users can update their profiles and view attendance history.
- **RESTful API:** Well-structured backend API for integration and automation.
- **Dockerized Deployment:** Easy setup using Docker and docker-compose.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** FastAPI (Python)
- **Database:** MySQL (AWS RDS) – see backend configuration
- **Authentication:** JWT-based
- **Containerization:** Docker, docker-compose
- **Cloud Storage:** S3-compatible for profile pictures
- **Computer Vision Models:** Yolo-Face & ResNet-100
- **RAG Intergation:** DeepSeak API
---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- (Optional for development) Node.js, Python 3.8+

### Quick Start (Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AI-Powered-Attendance-Management-System.git
   cd AI-Powered-Attendance-Management-System
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Cloud: https: https://attendance-app.com/ 


### Manual Setup (Development)

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

---

## Usage

- **User Registration/Login:** Register as a new user or log in with existing credentials.
- **Punch Attendance:** Mark your attendance from the dashboard.
- **Admin Panel:** Admins can manage users and view attendance logs.
- **Profile:** Update your profile and view your attendance history.
- **RAG chat bot:**: Users can chat with the bot inorder to access the user details and attendance logs

---

## Project Structure

```
AI-Powered-Attendance-Management-System/
  backend/
    app/
      auth/         # Authentication logic
      core/         # Core utilities (e.g., database)
      crud/         # Database operations
      models/       # ORM models
      routes/       # API endpoints
      schemas/      # Pydantic schemas
      static/       # Static files (e.g., profile pics)
      utils/        # Utility functions
  frontend/
    src/
      pages/        # React pages
      App.js        # Main app component
      config.js     # API config
  docker-compose.yml
  README.md
```

---

## API Documentation

- The backend provides interactive API docs at `/docs` (Swagger UI) and `/redoc`.

---

## Future Scope

1. **Face Recognition-Based Punch In:**
   - Integrate advanced face recognition models (ResNet-100 & YOLO-Face) for secure, contactless attendance marking.
   - Users will be able to punch in/out using facial authentication, enhancing security and convenience.

2. **RAG-Based Text-to-SQL Chatbot:**
   - Implement a Retrieval-Augmented Generation (RAG) chatbot capable of understanding natural language queries.
   - The chatbot will convert user/admin queries (e.g., "Show me all absentees last week") into SQL, fetching relevant attendance/user data.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

---


## Contact

For questions or support, please contact [ssmaheswar2001@gmail.com]. 