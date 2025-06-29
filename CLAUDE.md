# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Initial Setup
```bash
npm run install-deps  # Install dependencies for both root and client
```

### Development
```bash
npm run dev           # Start both server (port 3001) and client (port 3000) concurrently
npm run server        # Start only the Express server with nodemon
npm run client        # Start only the React client with Vite
```

### Client-Specific Commands
```bash
cd client && npm run build    # Build React app for production
cd client && npm run lint     # Run ESLint on React code
cd client && npm run preview  # Preview production build locally
```

## Architecture Overview

### Project Structure
- **Root**: Contains scripts to orchestrate both frontend and backend
- **`/server`**: Express.js API server (single file: `index.js`)
- **`/client`**: React frontend built with Vite

### Data Flow
- **Storage**: In-memory array in server process (data lost on restart)
- **API**: RESTful endpoints at `/api/students`, `/api/courses`, `/api/tasks`, `/api/chat`
- **Frontend**: Single-page React app that communicates with API via fetch()

### Key Technical Details
- **CORS**: Enabled on server to allow cross-origin requests from Vite dev server
- **Port Configuration**: Server runs on 3001, client dev server on 3000
- **Data Schema**: Three main entities with auto-incrementing IDs and relationships:
  - Students: `{ id, name, email, grade, courses[] }`
  - Courses: `{ id, title, description, students[], tasks[] }`
  - Tasks: `{ id, title, description, courseId, studentIds[], dueDate, completed }`
- **ID Generation**: Auto-incrementing integers starting from 2 (sample data has id 1)

### Component Architecture
- **Single Component App**: All functionality in `App.jsx` with hooks
- **State Management**: Local React state with `useState` for all entities
- **Tabbed Interface**: Four main sections (Students, Courses, Tasks, AI Chat)
- **Form Handling**: Separate form state for each entity with add/edit modes
- **API Integration**: `useEffect` for initial load, async functions for CRUD operations
- **Styling**: CSS classes in `App.css` with responsive grid layout

### AI Chat Integration
- **Mock AI**: Server-side keyword-based responses (not real AI)
- **Chat Interface**: Message history with user/ai message types
- **Context-aware**: Responses based on keywords in user messages