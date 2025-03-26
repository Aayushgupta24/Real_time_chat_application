const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Get all teams for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const teams = await Team.find({ members: req.user.userId });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching teams' });
    }
});

// Create a new team
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const team = new Team({
            name,
            owner: req.user.userId,
            members: [req.user.userId]
        });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Error creating team' });
    }
});

module.exports = router;