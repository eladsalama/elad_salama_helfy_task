## Overview
A full-stack task management application built with React and Express.js.
This modern and responsive task manager allows users to manage their tasks with full CRUD operations, priority levels, and filtering capabilities. The standout feature is the **infinite scrolling carousel** that displays tasks in a smooth, animated loop - implemented entirely in vanilla JavaScript/React without external libraries.

https://github.com/user-attachments/assets/56c70432-bb5d-4e54-a12b-694fd18cd70c

## Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server (with hot-reload)
npm run dev

# Or start the production server
npm start
```
Backend server will run on **http://localhost:4000**
Check backend health with: http://localhost:4000/health

### 2. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```
Frontend will automatically open at **http://localhost:3000**


## API Endpoints

All endpoints are prefixed with `/api`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| **GET** | `/api/tasks` | Get all tasks | - | `200 OK` + tasks array |
| **POST** | `/api/tasks` | Create a new task | `{title, description, priority}` | `201 Created` + new task |
| **PUT** | `/api/tasks/:id` | Update a task | `{title?, description?, priority?, completed?}` | `200 OK` + updated task |
| **DELETE** | `/api/tasks/:id` | Delete a task | - | `204 No Content` |
| **PATCH** | `/api/tasks/:id/toggle` | Toggle completion | - | `200 OK` + updated task |
| **GET** | `/health` | Health check | - | `200 OK` + status |

### Example API Requests

**Create a Task:**
```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Write comprehensive README",
    "priority": "high"
  }'
```

**Get All Tasks:**
```bash
curl http://localhost:4000/api/tasks
```

**Toggle Task Completion:**
```bash
curl -X PATCH http://localhost:4000/api/tasks/1/toggle
```

## Design Decisions
For UI/UX visual hierarchy and intuitive user interface i decided to implement 2 task carousels instead of only 1.
The first carousel is for pending tasks and the second one is for completed tasks. Marking tasks as completed or undoing that action moves the items between the carousels.

I also truncated text in titles and descriptions if they appear too long in the carousel (only in display, the full text is still being stored).

## Time Management 
Backend API: 60 minutes
Frontend Core Features: 70 minutes
Styling & Polish: 40 minutes
Testing & Debugging: 30 minutes

## Development Notes

This project was developed as a home assignment with the following considerations:
- **Time Constraint**: Built within recommended timeframe
- **MANDATORY Feature**: Endless carousel implemented without external libraries
- **Code Quality**: Clean, documented, and maintainable
- **Best Practices**: Component architecture, error handling, validation

