const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get Channel Messages
router.get('/channel/:channelId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({ 
            channelId: req.params.channelId,
            recipientId: null 
        }).populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Direct Messages
router.get('/direct/:userId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.userId, recipientId: req.params.userId },
                { sender: req.params.userId, recipientId: req.user.userId }
            ]
        }).populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
