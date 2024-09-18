const loggedin = require('../config/local-authenticator')
const Review = require('../models/Review')

const router = require('express').Router()

router.post('/:bookId', loggedin, async (req, res) => {
  const bookId = req.params.bookId

  if (!bookId) {
    return res.redirect('/')
  }

  const userId = req?.session?.passport?.user?._id

  const { reviewText, rating } = req.body

  const newReview = new Review({
    book: bookId,
    reviewer: userId,
    rating,
    reviewText,
  })

  await newReview.save()

  res.redirect(`/books/${bookId}`)
})

module.exports = router