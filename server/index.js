const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let students = [
  { id: 1, name: 'John Doe', email: 'john@example.com', grade: 'A', courses: [1], createdAt: new Date() }
];

let courses = [
  { id: 1, title: 'Mathematics 101', description: 'Basic mathematics course', students: [1], tasks: [1], createdAt: new Date() }
];

let tasks = [
  { id: 1, title: 'Algebra Homework', description: 'Complete exercises 1-10', courseId: 1, studentIds: [1], dueDate: '2024-01-15', completed: false, createdAt: new Date() }
];

let nextStudentId = 2;
let nextCourseId = 2;
let nextTaskId = 2;

// Students endpoints
app.get('/api/students', (req, res) => {
  res.json(students);
});

app.post('/api/students', (req, res) => {
  const { name, email, grade } = req.body;
  const student = {
    id: nextStudentId++,
    name,
    email,
    grade: grade || 'N/A',
    courses: [],
    createdAt: new Date()
  };
  students.push(student);
  res.status(201).json(student);
});

app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const { name, email, grade } = req.body;
  students[studentIndex] = { ...students[studentIndex], name, email, grade };
  res.json(students[studentIndex]);
});

app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  students.splice(studentIndex, 1);
  // Remove student from courses
  courses.forEach(course => {
    course.students = course.students.filter(studentId => studentId !== id);
  });
  // Remove student from tasks
  tasks.forEach(task => {
    task.studentIds = task.studentIds.filter(studentId => studentId !== id);
  });
  
  res.status(204).send();
});

// Courses endpoints
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.post('/api/courses', (req, res) => {
  const { title, description } = req.body;
  const course = {
    id: nextCourseId++,
    title,
    description,
    students: [],
    tasks: [],
    createdAt: new Date()
  };
  courses.push(course);
  res.status(201).json(course);
});

app.put('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === id);
  
  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  const { title, description } = req.body;
  courses[courseIndex] = { ...courses[courseIndex], title, description };
  res.json(courses[courseIndex]);
});

app.delete('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === id);
  
  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  courses.splice(courseIndex, 1);
  // Remove course from students
  students.forEach(student => {
    student.courses = student.courses.filter(courseId => courseId !== id);
  });
  // Remove tasks for this course
  tasks = tasks.filter(task => task.courseId !== id);
  
  res.status(204).send();
});

// Enroll student in course
app.post('/api/courses/:courseId/students/:studentId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = parseInt(req.params.studentId);
  
  const course = courses.find(c => c.id === courseId);
  const student = students.find(s => s.id === studentId);
  
  if (!course || !student) {
    return res.status(404).json({ error: 'Course or student not found' });
  }
  
  if (!course.students.includes(studentId)) {
    course.students.push(studentId);
  }
  if (!student.courses.includes(courseId)) {
    student.courses.push(courseId);
  }
  
  res.json({ message: 'Student enrolled successfully' });
});

// Tasks endpoints
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, courseId, studentIds, dueDate } = req.body;
  const task = {
    id: nextTaskId++,
    title,
    description,
    courseId,
    studentIds: studentIds || [],
    dueDate,
    completed: false,
    createdAt: new Date()
  };
  tasks.push(task);
  
  // Add task to course
  const course = courses.find(c => c.id === courseId);
  if (course && !course.tasks.includes(task.id)) {
    course.tasks.push(task.id);
  }
  
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, description, dueDate, completed } = req.body;
  tasks[taskIndex] = { ...tasks[taskIndex], title, description, dueDate, completed };
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  // Remove task from courses
  courses.forEach(course => {
    course.tasks = course.tasks.filter(taskId => taskId !== id);
  });
  
  res.status(204).send();
});

// AI Chatbot endpoint (mock implementation)
app.post('/api/chat', (req, res) => {
  const { message, context } = req.body;
  
  // Mock AI responses based on keywords
  let response = "I'm here to help you with your tutoring needs. ";
  
  if (message.toLowerCase().includes('student')) {
    response += "I can help you manage students, track their progress, and assign them to courses.";
  } else if (message.toLowerCase().includes('course')) {
    response += "I can assist with creating courses, managing content, and tracking student enrollment.";
  } else if (message.toLowerCase().includes('task') || message.toLowerCase().includes('assignment')) {
    response += "I can help you create assignments, set due dates, and track completion status.";
  } else if (message.toLowerCase().includes('grade') || message.toLowerCase().includes('score')) {
    response += "I can help you understand grading systems and track student performance.";
  } else {
    response += "You can ask me about managing students, creating courses, assigning tasks, or general tutoring advice.";
  }
  
  res.json({ 
    response,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});