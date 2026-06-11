const Settings = require('../models/Settings');

// @desc    Fetch personalized preference parameters
// @route   GET /api/settings/:userId
exports.getSettings = async (req, res) => {
    try {
        let preferences = await Settings.findOne({ user: req.params.userId });
        if (!preferences) {
            preferences = await Settings.create({ user: req.params.userId });
        }
        res.status(200).json(preferences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update user application configuration layout
// @route   PUT /api/settings/:userId
exports.updateSettings = async (req, res) => {
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
};