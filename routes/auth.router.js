const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt')
const notLoggedin = require('../config/no-login');
const User = require('../models/User');

router.get('/login', notLoggedin, (req, res) => {
  res.render('auth/login');
});

router.get('/signup', notLoggedin, (req, res) => {
  res.render('auth/login', { signup: true });
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userFound = await User.findOne({ email })

    if (userFound) {
      return res.redirect('/auth/login')
    }

    const hashed = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashed
    })

    await newUser.save()

    res.redirect('/auth/login')

  } catch (error) {
    console.error(error);
    res.redirect('/')
  }
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
}), (req, res) => {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/dashboard');
  }
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err); // Pass the error to the next middleware if any
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err); // Pass the error to the next middleware if any
      }
      res.redirect('/'); // Redirect to the login page after successful logout
    });
  });
});


module.exports = router;
