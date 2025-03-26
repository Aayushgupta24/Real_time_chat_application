const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Get all channels for a team
router.get('/team/:teamId', authMiddleware, async (req, res) => {
    try {
        const channels = await Channel.find({ team: req.params.teamId });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching channels' });
    }
});

// Create a new channel
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, teamId } = req.body;
        const channel = new Channel({
            name,
            team: teamId,
            createdBy: req.user.userId
        });
        await channel.save();
        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ error: 'Error creating channel' });
    }
});

module.exports = router;