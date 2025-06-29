# TutorAI - Student Management System

A comprehensive web application for tutors to manage students, courses, tasks, and access an AI chatbot assistant.

## Features

- **Student Management**: Add, edit, and remove students with detailed information
- **Course Management**: Create and manage courses with descriptions and student enrollment
- **Task Assignment**: Create tasks, assign them to courses and students, track completion
- **AI Chatbot**: Interactive AI assistant for tutoring guidance and support
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

- **Frontend**: React.js with Vite
- **Backend**: Express.js API server
- **Storage**: In-memory storage (data resets on server restart)
- **Port Configuration**: Server on port 3001, client dev server on port 3000

## Prerequisites

- Node.js (version 14 or higher)
- npm

## Installation & Setup

1. **Clone or download the project**
   ```bash
   cd tutorai
   ```

2. **Install all dependencies**
   ```bash
   npm run install-deps
   ```
   This command installs dependencies for both the root project and the client.

## Running the Application

### Development Mode (Recommended)

Start both server and client concurrently:
```bash
npm run dev
```

This will start:
- Express server on http://localhost:3001
- React client on http://localhost:3000

### Individual Components

**Start only the server:**
```bash
npm run server
```

**Start only the client:**
```bash
npm run client
```

### Production Mode

**Build the client:**
```bash
cd client && npm run build
```

**Start the server:**
```bash
npm start
```

## Usage

1. **Open your browser** and navigate to http://localhost:3000 (development) or http://localhost:3001 (production)

2. **Navigate through tabs:**
   - **Students**: Add, edit, and manage student information
   - **Courses**: Create courses and manage course details
   - **Tasks**: Create assignments, set due dates, and assign to courses
   - **AI Chat**: Interact with the AI tutor assistant

3. **Managing Students:**
   - Fill out the form with student name, email, and grade
   - Click "Add Student" to create a new student
   - Use "Edit" to modify existing student information
   - Use "Delete" to remove students (this also removes them from courses and tasks)

4. **Creating Courses:**
   - Enter course title and description
   - Click "Add Course" to create
   - View enrolled students and assigned tasks count

5. **Assigning Tasks:**
   - Create tasks with title, description, course selection, and due date
   - Tasks are automatically linked to the selected course
   - Track completion status

6. **AI Chatbot:**
   - Ask questions about student management, course creation, or tutoring advice
   - Get contextual responses based on your queries

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:courseId/students/:studentId` - Enroll student in course

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Chat
- `POST /api/chat` - Send message to AI assistant

## Data Structure

### Student
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "grade": "A",
  "courses": [1, 2],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Course
```json
{
  "id": 1,
  "title": "Mathematics 101",
  "description": "Basic mathematics course",
  "students": [1, 2],
  "tasks": [1],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Task
```json
{
  "id": 1,
  "title": "Algebra Homework",
  "description": "Complete exercises 1-10",
  "courseId": 1,
  "studentIds": [1, 2],
  "dueDate": "2024-01-15",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Technical Notes

- **Data Persistence**: All data is stored in memory and will be lost when the server restarts
- **CORS**: Enabled for cross-origin requests between client and server
- **Auto-increment IDs**: Automatic ID generation for all entities
- **Sample Data**: Includes sample student, course, and task for demonstration

## Development

The project structure:
```
tutorai/
├── package.json          # Root package.json with scripts
├── server/
│   └── index.js         # Express.js server
├── client/              # React application
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── ...
└── README.md
```

## Troubleshooting

**Port conflicts**: If ports 3001 or 3000 are in use, you may need to:
- Kill processes using those ports
- Modify the port configuration in the respective files

**Dependencies issues**: Run `npm run install-deps` again to ensure all dependencies are properly installed.

**CORS errors**: Make sure both server and client are running on their respective ports.