const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const adminOnly = require('../config/admin.config')
const Order = require('../models/Order')
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

router.get('/', loggedin, async (req, res) => {
  const user = req.session.passport.user

  if (user.role === 'admin') {
    const orders = await Order.find()
    return res.render('shop/order-list', { layout: 'layouts/admin-layout-v2', orders })
  }

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    return res.redirect('/dashboard')
  }

  // Fetch all orders for the user
  const orders = await Order.find({ user: user._id })

  res.render('shop/order-list', { layout: 'layouts/admin-layout-v2', orders })
})

router.post('/checkout', loggedin, async (req, res) => {
  const cart = req.session.cart

  const line_items = Object.entries(cart.items).map(([key, value]) => {
    return { price: value.item.stripePriceId, quantity: value.qty }
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.SERVER_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SERVER_URL}/orders/cancel`,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['GB', 'BN', 'US'],
    },
  })

  // await fs.writeFile(`${path.resolve('public', 'uploads')}/stripe-response.json`, JSON.stringify(session, null, 2))

  res.redirect(303, session.url);
})

router.get('/success', async (req, res) => {

  if (req.query.session_id) {
    const [stripeSession, lineItems] = (await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, {
        expand: ['payment_intent.payment_method']
      }),
      stripe.checkout.sessions.listLineItems(req.query.session_id)
    ]))

    const line_items = lineItems.data.map((item) => ({
      title: item.description,
      quantity: item.quantity,
      price: item.amount_total,
      unit_price: item.price.unit_amount,
    }))

    const user = req.session.passport.user

    const order = new Order({
      amount_subtotal: stripeSession.amount_subtotal / 100,
      amount_total: stripeSession.amount_total / 100,
      customer_details: stripeSession.customer_details,
      shipping_details: stripeSession.payment_intent.shipping,
      line_items,
      stripe_session_id: stripeSession.id,
      user: new mongoose.Types.ObjectId(user._id)
    })

    const saved = await order.save()
    console.log({ saved });

  }

  req.session.cart = undefined
  res.render('payment', { success: true })
})

router.get('/cancel', (req, res) => {
  res.render('payment', { success: false })
})

router.get('/complete/:orderId', loggedin, adminOnly, async (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res.redirect('/orders')
  }

  await Order.findByIdAndUpdate(orderId, { status: 'Completed' })

  res.redirect('/orders')
})

router.get('/:id', loggedin, async (req, res) => {
  const id = req.params.id

  const order = await Order.findById(id)

  if (!order) {
    return res.redirect('/dashboard')
  }

  res.render('shop/order-details', { layout: 'layouts/admin-layout-v2', order })
})

module.exports = router