const express = require('express');
const router = express.Router();
const User = require('../models/User');

const ITEMS_PER_PAGE = 10;

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const timePeriod = req.query.timePeriod || 'all-time';
        
        // In a real app, you would filter by time period here
        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .sort({ points: -1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
            
        res.render('leaderboards/index', {
            title: 'Leaderboards',
            users,
            timePeriod,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;