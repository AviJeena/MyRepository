const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// @route   GET /api/notes/:userId
router.get('/:userId', async (req, res) => {
    try {
        const userNotes = await Note.find({ user: req.params.userId }).sort({ updatedAt: -1 });
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/notes
router.post('/', async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/notes/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Note document deleted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;