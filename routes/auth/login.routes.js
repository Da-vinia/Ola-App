//const express = require('express');
// const loginRouter = express.Router();
const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const User = require('../../models/User.model');

// router.get('/login', (req, res) => res.render('auth/login'));

// router.get('/profile', (req, res) => {
//     res.render('user/profile', { userInSession: req.session.currentUser });
//   });

router.get('/posts', (req, res) => {
    res.render('posts', { userInSession: req.session.currentUser });
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if(username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Surfer, please enter both, your username and password to login 👆'
        });
        return;
    }
    User.findOne({username})
        .then(user => {
            if(!user) {
                res.render('auth/login', {
                    errorMessage: 'User not found and/or incorrect password 🤖'
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/posts');
            } else {
                res.render('auth/login', {errorMessage: 'User not found and/or incorrect password 🤖'});
            }
        })
        .catch(error => next(error));
});

// const isAuthenticated = (req, res, next) => {
//     if(req.session.currentUser) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// };

module.exports = router;