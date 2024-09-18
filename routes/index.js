const { getCartLength } = require('../config/cart.config');
const Book = require('../models/Book');
const Review = require('../models/Review');

const router = require('express').Router()

// Routes
router.get("/", async (req, res) => {
  const books = await Book.find()
  const bookIds = books.map(book => book._id)

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


  res.render("index", { books: booksWithRatings, topPicks: booksWithRatings.slice(0, 4), cartQty: getCartLength(req?.session?.cart) });
});

router.get("/cart", (req, res) => {
  res.render("cart");
});
router.get("/checkout", (req, res) => {
  res.render("checkout");
});

module.exports = router