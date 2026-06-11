const Note = require('../models/Note');

// @desc    Get student notes
// @route   GET /api/notes/:userId
exports.getNotes = async (req, res) => {
    try {
        const userNotes = await Note.find({ user: req.params.userId }).sort({ updatedAt: -1 });
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new lecture note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update a specific note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete a note document
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note document deleted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};