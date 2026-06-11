const Exam = require('../models/Exam');

// @desc    Get all scheduled exams for a student
// @route   GET /api/exams/:userId
exports.getExams = async (req, res) => {
    try {
        const studentExams = await Exam.find({ user: req.params.userId }).sort({ examDate: 1 });
        res.status(200).json(studentExams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create/Schedule an exam profile
// @route   POST /api/exams
exports.createExam = async (req, res) => {
    try {
        const newExam = await Exam.create(req.body);
        res.status(201).json(newExam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update exam tracking cards or input grades
// @route   PUT /api/exams/:id
exports.updateExam = async (req, res) => {
    try {
        const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};