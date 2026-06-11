const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    tags: [String],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically update the timestamp on modification
NoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Note', NoteSchema);