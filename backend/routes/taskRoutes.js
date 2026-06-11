const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const express = require('express');
const router = express.Router();
// Import the specific controller methods
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// The route is now locked behind a verification firewall check
router.route('/').post(protect, createTask);
router.route('/:userId').get(protect, getTasks);

// Map endpoints directly to cleaner controller references
router.route('/:userId').get(getTasks);
router.route('/').post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);



// @route   GET /api/tasks/:userId
// @desc    Get all tasks assigned to a specific student
router.get('/:userId', async (req, res) => {
    try {
        const userTasks = await Task.find({ user: req.params.userId });
        res.status(200).json(userTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task instance
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update task attributes (e.g., changing column state from 'todo' to 'progress')
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete an absolute task card reference
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task item discarded successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;