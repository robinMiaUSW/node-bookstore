const loggedin = require('../config/local-authenticator')
const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcrypt')

router.get('/', loggedin, async (req, res) => {
  const users = await User.find()
  res.render('users/index', { layout: 'layouts/admin-layout-v2', users })
})

router.get('/create', loggedin, async (req, res) => {
  res.render('users/create', { layout: 'layouts/admin-layout-v2' })
})


router.post('/', loggedin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const userFound = await User.findOne({ email })

    if (userFound) {
      return res.redirect('/auth/login')
    }

    const hash = await bcrypt.hash(password, 10)

    const user = new User({ email, name, password: hash, role })
    await user.save()

    return res.redirect('/admin/users')

  } catch (err) {
    console.error(err);
    res.redirect('/')
  }
});

router.get('/changeRole/:id', loggedin, async (req, res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.redirect('/dashboard')
    }

    const user = await User.findById(id)

    if (!user) {
      return res.redirect('/dashboard')
    }

    await User.findByIdAndUpdate(id, { role: user.role === 'admin' ? 'customer' : 'admin' })

    res.redirect('/admin/users')
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard')
  }
})

module.exports = router