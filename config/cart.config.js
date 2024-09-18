const Cart = require("../models/Cart")

exports.getCartLength = function (cartData) {
  if (!cartData) return 0
  const cart = new Cart(cartData)
  return Object.keys(cart.items).length
}