const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subjectName: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true
    },
    examDate: {
        type: Date,
        required: [true, 'Exam date and time are required']
    },
    location: {
        type: String, // e.g., "Hall A" or "Online"
        trim: true
    },
    syllabusNotes: {
        type: String,
        default: ''
    },
    gradeReceived: {
        type: String, // e.g., "A", "B+", "95%"
        default: null
    }
});

module.exports = mongoose.model('Exam', ExamSchema);