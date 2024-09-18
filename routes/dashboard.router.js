const router = require('express').Router()
const passport = require('passport')
const isLoggedIn = require('../config/local-authenticator')
const Book = require('../models/Book')
const User = require('../models/User')
const Order = require('../models/Order')
const Review = require('../models/Review')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

router.get('/', isLoggedIn, async (req, res) => {
  const user = req.session.passport.user

  if (user.role === 'admin') {
    const books = await Book.find()
    const balances = await stripe.balance.retrieve();
    const orders = await Order.find()
    const users = await User.find()
    res.render('dashboard/v2', { layout: 'layouts/admin-layout-v2', books, totalCollection: balances.pending[0].amount / 100, users, orders })
  } else {
    const books = await Book.find()
    const bookIds = books.map(book => book._id)
    const orders = Order.find({ user: user._id })
    const bookRatings = await Review.aggregate([
      // Match reviews for the specified book IDs
      { $match: { book: { $in: bookIds } } },
      // Group by book ID and calculate the average rating
      {
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 } // Optional: Count the number of reviews
        }
      }
    ]);

    // Combine the ratings with the books
    const booksWithRatings = books.map(book => {
      const ratingInfo = bookRatings.find(
        r => r._id.toString() === book._id.toString()  // Convert ObjectId to string for comparison
      );
      return {
        ...book.toObject(),
        averageRating: ratingInfo ? ratingInfo.averageRating : 0,
        totalReviews: ratingInfo ? ratingInfo.totalReviews : 0
      };
    });
    res.render('index', { layout: 'layouts/admin-layout-v2', books: booksWithRatings, orders, topPicks: booksWithRatings.slice(0, 4), inDashboard: true })
  }

})

router.get('/v2', async (req, res) => {
  const balances = await stripe.balance.retrieve();
  const users = await User.find()
  const orders = await Order.find()

  const books = await Book.find()
  res.render('dashboard/v2', {
    layout: 'layouts/admin-layout-v2',
    books,
    totalCollection: balances.pending[0].amount / 100,
    users,
    orders,
  })
})

router.get('/settings', isLoggedIn, async (req, res) => {
  res.render('dashboard/settings', { layout: 'layouts/admin-layout' })
})


module.exports = router