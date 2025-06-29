import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api'

function App() {
  const [activeTab, setActiveTab] = useState('students')
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [tasks, setTasks] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')

  // Student form state
  const [studentForm, setStudentForm] = useState({ name: '', email: '', grade: '' })
  const [editingStudent, setEditingStudent] = useState(null)

  // Course form state
  const [courseForm, setCourseForm] = useState({ title: '', description: '' })
  const [editingCourse, setEditingCourse] = useState(null)

  // Task form state
  const [taskForm, setTaskForm] = useState({ title: '', description: '', courseId: '', studentIds: [], dueDate: '' })
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchStudents()
    fetchCourses()
    fetchTasks()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses`)
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingStudent 
        ? `${API_BASE}/students/${editingStudent.id}`
        : `${API_BASE}/students`
      const method = editingStudent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      })
      
      if (response.ok) {
        setStudentForm({ name: '', email: '', grade: '' })
        setEditingStudent(null)
        fetchStudents()
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleEditStudent = (student) => {
    setStudentForm({ name: student.name, email: student.email, grade: student.grade })
    setEditingStudent(student)
  }

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/students/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchStudents()
        fetchCourses()
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCourse 
        ? `${API_BASE}/courses/${editingCourse.id}`
        : `${API_BASE}/courses`
      const method = editingCourse ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      })
      
      if (response.ok) {
        setCourseForm({ title: '', description: '' })
        setEditingCourse(null)
        fetchCourses()
      }
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  const handleEditCourse = (course) => {
    setCourseForm({ title: course.title, description: course.description })
    setEditingCourse(course)
  }

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/courses/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchCourses()
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingTask 
        ? `${API_BASE}/tasks/${editingTask.id}`
        : `${API_BASE}/tasks`
      const method = editingTask ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      })
      
      if (response.ok) {
        setTaskForm({ title: '', description: '', courseId: '', studentIds: [], dueDate: '' })
        setEditingTask(null)
        fetchTasks()
        fetchCourses()
      }
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEditTask = (task) => {
    setTaskForm({ 
      title: task.title, 
      description: task.description, 
      courseId: task.courseId, 
      studentIds: task.studentIds,
      dueDate: task.dueDate 
    })
    setEditingTask(task)
  }

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTasks()
        fetchCourses()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { text: chatInput, sender: 'user', timestamp: new Date() }
    setChatMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      })
      
      const data = await response.json()
      const aiMessage = { text: data.response, sender: 'ai', timestamp: new Date() }
      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
    }

    setChatInput('')
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId)
    return student ? student.name : 'Unknown Student'
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : 'Unknown Course'
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TutorAI - Student Management System</h1>
        <nav className="tab-nav">
          <button 
            className={activeTab === 'students' ? 'active' : ''} 
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={activeTab === 'courses' ? 'active' : ''} 
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button 
            className={activeTab === 'tasks' ? 'active' : ''} 
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button 
            className={activeTab === 'chat' ? 'active' : ''} 
            onClick={() => setActiveTab('chat')}
          >
            AI Chat
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'students' && (
          <div className="students-section">
            <h2>Student Management</h2>
            
            <form onSubmit={handleStudentSubmit} className="student-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Student Name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Grade"
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})}
                />
                <button type="submit">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
                {editingStudent && (
                  <button type="button" onClick={() => {
                    setEditingStudent(null)
                    setStudentForm({ name: '', email: '', grade: '' })
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="students-list">
              {students.map(student => (
                <div key={student.id} className="student-card">
                  <h3>{student.name}</h3>
                  <p>Email: {student.email}</p>
                  <p>Grade: {student.grade}</p>
                  <p>Courses: {student.courses.length}</p>
                  <div className="student-actions">
                    <button onClick={() => handleEditStudent(student)}>Edit</button>
                    <button onClick={() => handleDeleteStudent(student.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>Course Management</h2>
            
            <form onSubmit={handleCourseSubmit} className="student-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  required
                />
                <button type="submit">
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
                {editingCourse && (
                  <button type="button" onClick={() => {
                    setEditingCourse(null)
                    setCourseForm({ title: '', description: '' })
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p>Students: {course.students.length}</p>
                  <p>Tasks: {course.tasks.length}</p>
                  <div className="student-actions">
                    <button onClick={() => handleEditCourse(course)}>Edit</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <h2>Task Management</h2>
            
            <form onSubmit={handleTaskSubmit} className="student-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  required
                />
                <select
                  value={taskForm.courseId}
                  onChange={(e) => setTaskForm({...taskForm, courseId: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  required
                />
                <button type="submit">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                {editingTask && (
                  <button type="button" onClick={() => {
                    setEditingTask(null)
                    setTaskForm({ title: '', description: '', courseId: '', studentIds: [], dueDate: '' })
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Course: {getCourseName(task.courseId)}</p>
                  <p>Due: {task.dueDate}</p>
                  <p>Students: {task.studentIds.map(id => getStudentName(id)).join(', ')}</p>
                  <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                  <div className="student-actions">
                    <button onClick={() => handleEditTask(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-section">
            <h2>AI Tutor Assistant</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    <div className="message-content">
                      {message.text}
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="chat-form">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the AI tutor assistant..."
                  className="chat-input"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
