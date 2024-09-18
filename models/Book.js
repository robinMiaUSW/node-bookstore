const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
    length: 50
  },
  longDescription: {
    type: String,
    default: '',
  },
  image: {
    type: {
      imagePath: { type: String, required: true },
      imageID: { type: String, required: true },
    },
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema)
module.exports = Book;

