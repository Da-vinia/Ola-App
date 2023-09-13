const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../../models/User.model');
const mongoose = require('mongoose');
const { isLoggedOut } = require('../../middleware/route-guard');

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
      }
     
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        res.redirect('/profile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
               errorMessage: 'User not found and/or incorrect password.'
            });
          } else {
            next(error);
          }
        }); 
    }) 








module.exports = router;