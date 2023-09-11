//const express = require('express').Router();
// const loginRouter = express.Router();
const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const User = require('../../models/User.model');

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if(username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Surfer, please enter both, your username and password to login'
        });
        return;
    }
    User.findOne({username})
        .then(user => {
            if(!user) {
                re.render('auth/login', {
                    errorMessage: 'User not found and/or incorrect password 🤖'
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/posts');
            } else {
                res.render('auth/login', {errorMessage: 'User not found and/or incorrect password 🤖'})
            }
        })
        .catch(error => next(error));
})

const isAuthenticated = (req, res, next) => {
    if(req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = router;