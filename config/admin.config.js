const adminOnly = (req, res, next) => {
  if (req.isAuthenticated() && req?.session?.passport?.user?.role === 'admin') {
    next()
  } else {
    res.redirect('/auth/login')
  }
}

module.exports = adminOnly