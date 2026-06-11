const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// @route   GET /api/exams/:userId
router.get('/:userId', async (req, res) => {
    try {
        const studentExams = await Exam.find({ user: req.params.userId }).sort({ examDate: 1 });
        res.status(200).json(studentExams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/exams
router.post('/', async (req, res) => {
    try {
        const newExam = await Exam.create(req.body);
        res.status(201).json(newExam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/exams/:id
// @desc    Update exam syllabus tracking details or post achieved grades
router.put('/:id', async (req, res) => {
    try {
        const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;