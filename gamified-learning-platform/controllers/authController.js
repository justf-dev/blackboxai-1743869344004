const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = {
    // Show login form
    loginForm: (req, res) => {
        res.render('auth/login', {
            title: 'Login',
            error: req.flash('error')
        });
    },

    // Handle login
    login: passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }),

    // Show registration form
    registerForm: (req, res) => {
        res.render('auth/register', {
            title: 'Register',
            error: req.flash('error')
        });
    },

    // Handle registration
    register: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;
            
            // Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                req.flash('error', 'Email already registered');
                return res.redirect('/auth/register');
            }

            // Create new user
            user = new User({
                username,
                email,
                password,
                role,
                points: 0,
                badges: []
            });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Login after registration
            req.login(user, (err) => {
                if (err) throw err;
                res.redirect('/dashboard');
            });

        } catch (err) {
            console.error(err);
            req.flash('error', 'Server error');
            res.redirect('/auth/register');
        }
    },

    // Handle logout
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};