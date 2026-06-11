const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// @route   GET /api/settings/:userId
router.get('/:userId', async (req, res) => {
    try {
        let preferences = await Settings.findOne({ user: req.params.userId });
        if (!preferences) {
            // Instantiate default settings profile if none exists yet
            preferences = await Settings.create({ user: req.params.userId });
        }
        res.status(200).json(preferences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/settings/:userId
router.put('/:userId', async (req, res) => {
    try {
        const revisedPreferences = await Settings.findOneAndUpdate(
            { user: req.params.userId },
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json(revisedPreferences);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;