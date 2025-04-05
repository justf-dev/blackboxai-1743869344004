const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'LearnQuest - Gamified Learning Platform',
        user: req.user
    });
});

// Dashboard
router.get('/dashboard', (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    res.render('dashboard/index', {
        title: 'Dashboard',
        user: req.user
    });
});

module.exports = router;