const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One settings document per user profile
    },
    darkMode: {
        type: Boolean,
        default: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pomodoroDuration: {
        type: Number,
        default: 25 // Default focus interval time in minutes
    },
    shortBreakDuration: {
        type: Number,
        default: 5
    }
});

module.exports = mongoose.model('Settings', SettingsSchema);