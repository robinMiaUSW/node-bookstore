module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {}
  this.totalQty = oldCart.totalQty || 0
  this.totalPrice = oldCart.totalPrice || 0

  this.add = function (item, id) {
    let storedItem = this.items[id]

    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
    }
    storedItem.qty++
    storedItem.price = parseFloat((storedItem.item.price * storedItem.qty).toFixed(2))

    this.totalQty++
    this.totalPrice += storedItem.item.price
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2))
  }

  this.reduceByOne = function (id) {
    this.items[id].qty--
    this.items[id].price -= this.items[id].item.price
    this.totalQty--
    this.totalPrice -= this.items[id].item.price
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2))

    if (this.items[id].qty <= 0) {
      delete this.items[id]
    }
  }

  this.removeItem = function (id) {
    this.totalQty -= this.items[id].qty
    this.totalPrice -= this.items[id].price
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2))
    delete this.items[id]
  }

  this.generateArray = function () {
    let arr = []

    for (let id in this.items) {
      arr.push(this.items[id])
    }
    return arr
  }
}