const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

// @route   GET /api/profile/:userId
// @desc    Fetch personalized user profile summary alongside computation metrics
router.get('/:userId', async (req, res) => {
    try {
        const student = await User.findById(req.params.userId);
        if (!student) return res.status(404).json({ message: 'Student profile not found.' });

        const completedCount = await Task.countDocuments({ user: req.params.userId, column: 'completed' });
        const pendingCount = await Task.countDocuments({ user: req.params.userId, column: 'todo' });

        res.status(200).json({
            username: student.username,
            email: student.email,
            department: student.department,
            stats: {
                completedTasks: completedCount,
                pendingTasks: pendingCount,
                focusHoursMock: 12 // Can be hooked into timer trackers
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;