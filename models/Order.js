const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stripe_session_id: {
    type: String,
    required: true,
  },
  amount_subtotal: {
    type: Number,
    required: true,
  },
  amount_total: {
    type: Number,
    required: true,
  },
  customer_details: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String, // Optional phone number
      address: {
        type: new mongoose.Schema({
          city: String,
          country: String,
          line1: String,
          line2: String,
          postal_code: String,
          state: String, // Optional state field
        }),
      },
    })
  },
  shipping_details: {
    type: new mongoose.Schema({
      shipping: {
        address: {
          city: String,
          country: String,
          line1: String,
          line2: String,
          postal_code: String,
          state: String
        },
        carrier: String,
        name: String,
        phone: String,
        tracking_number: String
      }
    })
  },
  line_items: [
    {
      title: String,
      unit_price: Number,
      quantity: Number,
      price: Number,
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
}, {
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order