const bcrypt = require('bcrypt')
const User = require('../models/User')

async function seed() {
  const users = await User.find()

  if (users.length > 0) return

  const hashed = await bcrypt.hash('admin', 10)
  const newUser = new User({
    name: 'Administrator',
    email: 'admin@shop.com',
    password: hashed,
    role: 'admin'
  })
  await newUser.save()
  console.log('Seeded a user');

}

module.exports = seed