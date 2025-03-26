const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// Get messages for a specific channel
router.get('/channel/:channelId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({ 
            channelId: req.params.channelId,
            recipientId: null 
        })
        .populate('sender', 'username')
        .sort({ createdAt: 1 })
        .limit(50);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching channel messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Get direct messages between two users
router.get('/direct/:userId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.userId, recipientId: req.params.userId },
                { sender: req.params.userId, recipientId: req.user.userId }
            ],
            channelId: null
        })
        .populate('sender', 'username')
        .sort({ createdAt: 1 })
        .limit(50);
        
        res.json(messages);
    } catch (error) {
        console.error('Error fetching direct messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

module.exports = router;

