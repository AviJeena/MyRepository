const Task = require('../models/Task');

// @desc    Get all tasks for a specific student
// @route   GET /api/tasks/:userId
exports.getTasks = async (req, res) => {
    try {
        const userTasks = await Task.find({ user: req.params.userId });
        res.status(200).json(userTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new task instance
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update task attributes (e.g., changing column state)
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete a task reference
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task item discarded successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};