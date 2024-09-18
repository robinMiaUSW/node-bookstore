const bcrypt = require('bcrypt')
const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      console.log('reached');

      const user_found = await User.findOne({ email: email })

      if (user_found) {
        const match_password = await bcrypt.compare(password, user_found.password)

        if (match_password) {
          done(null, {
            _id: user_found._id,
            name: user_found.name,
            email: user_found.email,
            role: user_found.role
          })
        } else {
          done(null, false)
        }
      } else {
        done(null, false)
      }
    } catch (error) {
      done(error)
    }
  }))

  passport.serializeUser((user, done) => { done(null, user) })
  passport.deserializeUser((user, done) => { done(null, user) })
}