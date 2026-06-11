const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ==========================================
// Middleware Configuration
// ==========================================
app.use(cors());                  // Enable Cross-Origin Resource Sharing
app.use(express.json());          // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true }));
// Add these route mounting statements right under your basic express declarations
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Serve static assets directly from your frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// Mock Database / State Containers
// ==========================================
let tasks = [
    { id: 1, title: "Complete DBMS Assignment", column: "todo", priority: "high" },
    { id: 2, title: "Lab Report 3", column: "progress", priority: "medium" },
    { id: 3, title: "SQL Quiz Prep", column: "completed", priority: "low" }
];

let notes = {
    "System Design Patterns": "Explore architectural blueprints like Microservices, MVC, and Pub-Sub messaging brokers.",
    "Compiler Design Formulae": "LL(1) parsing rules, First and Follow sets calculation steps, and AST conversions."
};

// ==========================================
// API REST Routes
// ==========================================

// 1. Task Management Endpoint Stubs
app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title, priority } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Task title is required" });
    }
    const newTask = {
        id: tasks.length + 1,
        title,
        column: "todo",
        priority: priority || "medium"
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// 2. Academic Notes Endpoint Stubs
app.get('/api/notes', (req, res) => {
    res.status(200).json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Note title is required" });
    }
    notes[title] = content || "";
    res.status(200).json({ message: "Note saved successfully", notes });
});

// 3. User Metrics Endpoint Stub
app.get('/api/profile/stats', (req, res) => {
    res.status(200).json({
        username: "Student User",
        department: "Computer Science & Engineering",
        completedTasks: tasks.filter(t => t.column === 'completed').length,
        focusHours: 8
    });
});

// ==========================================
// Frontend Routing Fallback
// ==========================================
// Wildcard route to handle client-side page transitions elegantly
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Global Middlewares (Must be declared at the bottom of your express pipeline)
app.use(notFound);
app.use(errorHandler);

// ==========================================
// Server Initialization
// ==========================================
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` 🚀 EduPlan Backend Server is running on Port: ${PORT}`);
    console.log(` 📂 Serving frontend from: ${path.join(__dirname, '../frontend')}`);
    console.log(`===================================================`);
});

