const notLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.session.oldUrl) {
      res.redirect(req.session.oldUrl)
    } else {
      res.redirect('/dashboard')
    }
  } else {
    next()
  }
}

module.exports = notLoggedin