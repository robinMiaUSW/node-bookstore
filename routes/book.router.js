const crypto = require('crypto')
const { promisify } = require("util");
const path = require('path')
const loggedin = require('../config/local-authenticator')
const Book = require('../models/Book')
const Review = require('../models/Review')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

const router = require('express').Router()

const ALLOWED_EXTENSIONS = /png|jpg|jpeg/;

router.get('/', loggedin, async (req, res) => {
  const books = await Book.find()

  res.render('dashboard/books/list', { books, layout: 'layouts/admin-layout-v2' })
})

router.get('/create', loggedin, (req, res) => {
  req.session.oldUrl = '/books/create'
  res.render('dashboard/books/create', { layout: 'layouts/admin-layout-v2' })
})

router.post('/', loggedin, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      shortDescription,
      longDescription,
      genre,
      price,
    } = req.body

    const image = req.files.image
    const imageID = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(image.name);
    const fileName = `${imageID}-${title}.${ext}`;

    if (!ALLOWED_EXTENSIONS.test(ext)) {
      return res.redirect('/dashboard')
    }

    const url = `${path.resolve('public', 'uploads', 'products')}/${fileName}`;
    const urlToSave = `/uploads/products/${fileName}`
    await promisify(image.mv)(url);

    const stripePrice = await stripe.prices.create({
      currency: 'gbp',
      unit_amount: price * 100,
      product_data: {
        name: title,
      },
      metadata: {
        author,
        publisher
      }
    })
    console.log(stripePrice);


    const newBook = new Book({
      title,
      author,
      isbn,
      publisher,
      shortDescription,
      longDescription,
      genre,
      price,
      image: {
        imageID,
        imagePath: urlToSave,
      },
      stripePriceId: stripePrice.id
    })

    await newBook.save()
    res.redirect('/dashboard')
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard')
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const book = await Book.findById(id)
  const reviews = await Review.find({ book: id }).populate('reviewer')
  res.render('dashboard/books/details', { book, reviews })
})

module.exports = router