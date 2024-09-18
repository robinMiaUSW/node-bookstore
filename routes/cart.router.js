const Cart = require('../models/Cart')
const Book = require('../models/Book')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const loggedin = require('../config/local-authenticator')
const fs = require('fs-extra')
const path = require('path')
const { Types } = require('mongoose')

const router = require('express').Router()

router.get('/details', async (req, res) => {
  req.session.oldUrl = '/cart/details'
  if (!req.session.cart) {
    console.log('No cart');
    return res.render('shop/cart-details', { books: [] })
  }

  const cart = new Cart(req.session.cart)

  const oldUrl = '/'
  req.session.oldUrl = oldUrl

  res.render('shop/cart-details', {
    cartQty: Object.keys(cart.items).length,
    books: cart.generateArray(),
    totalPrice: cart.totalPrice,
  })
})

router.get('/add/:id', async (req, res) => {
  try {
    const id = req.params.id

    req.session.oldUrl = `/cart/add/${id}`

    const cart = new Cart(req?.session?.cart ?? {})

    const book = await Book.findById(id)

    if (!book) {
      console.error('no books found');
      return res.redirect('/')
    }

    cart.add(book, book._id)

    req.session.cart = cart

    res.redirect('/')
  } catch (error) {
    console.error(error);
    res.redirect('/')
  }
})

router.get('/remove/:id', (req, res) => {
  const id = req.params.id
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(id)
  req.session.cart = cart
  res.redirect('/cart/details')
})

router.get('/decrease/:id', (req, res) => {
  const id = req.params.id
  const cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(id)
  req.session.cart = cart
  res.redirect('/cart/details')
})

router.get('/increase/:id', async (req, res) => {
  try {
    const id = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})

    const book = await Book.findById(id)

    if (!book) {
      return res.redirect('/')
    }
    cart.add(book, book._id)
    req.session.cart = cart
    res.redirect('/cart/details')
  } catch (error) {
    console.error(error);
    return res.redirect('/')
  }
})

router.post('/checkout', loggedin, async (req, res) => {
  const cart = req.session.cart

  const line_items = Object.entries(cart.items).map(([key, value]) => {
    return { price: value.item.stripePriceId, quantity: value.qty }
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${process.env.SERVER_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SERVER_URL}/orders/cancel`,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['GB', 'BN', 'US'],
    },
  })

  await fs.writeFile(`${path.resolve('public', 'uploads')}/stripe-response.json`, JSON.stringify(session, null, 2))

  res.redirect(303, session.url);
})

// router.get('/success', async (req, res) => {
//   if (req.session.session_id) {
//     const [stripeSession, lineItems] = (await Promise.all([
//       stripe.checkout.sessions.retrieve(req.query.session_id, {
//         expand: ['payment_intent.payment_method']
//       }),
//       stripe.checkout.sessions.listLineItems(req.query.session_id)
//     ]))

//   }

//   req.session.cart = undefined
//   res.render('payment', { success: true })
// })

// router.get('/cancel', (req, res) => {
//   res.render('payment', { success: false })
// })

module.exports = router