const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const User = require('../../models/User.model');
const { isLoggedOut } = require('../../middleware/route-guard');


router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login', { layout: "layouts/main", userInSession: req.session.currentUser });
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Surfer, please enter both, your username and password to login 👆', layout: "layouts/main"
        });
        return;
    }
    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: 'User not found and/or incorrect password 🤖', layout: "layouts/main"
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/posts');
            } else {
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect password 🤖',  layout: "layouts/main" });
            }
        })
        .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {

    req.session.destroy(err => {
        res.cookie('connect.sid', null, {
            expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
            httpOnly: true,
        });
        if (err) next(err);
        res.redirect("/");
    });
});

module.exports = router;