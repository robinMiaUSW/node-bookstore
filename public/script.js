//sample product data
const products = [
  { id: "0001", name: "Product 1", price: 10.0 },
  { id: "0002", name: "Product 2", price: 20.0 },
  { id: "0003", name: "Product 3", price: 15.0 },
  { id: "0004", name: "Product 4", price: 25.0 },
  { id: "0005", name: "Product 5", price: 30.0 },
  { id: "0006", name: "Product 6", price: 35.0 },
  { id: "0007", name: "Product 7", price: 40.0 },
  { id: "0008", name: "Product 8", price: 45.0 },
  { id: "0009", name: "Product 9", price: 50.0 },
  { id: "0010", name: "Product 10", price: 55.0 },
];

//Add cart functionality
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (catrItem) {
    catrItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart");
}

//Display cart items

function displayCartItems() {
  const cartItemsDiv = document.querySelector(".cart-items");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsDiv.innerHTML = "";

  cart.forEach((item) => {
    const cartItemDiv = document.crreateElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.innerHTML = <h3>${item.name}</h3>;
    <p>
      $${item.price} x ${item.quantity}
    </p>;
    <button onclick="removeFromCart(${item.id})">Remove</button>;
    cartItemsDiv.appendChild(cartItemDiv);
  });
}

//Remove from cart functionality
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
}
//Checkout functionality

function checkout() {
  window.location.href = "checkout.html";
}

//Submit order functionality
function submitOrder(event) {
  event.preventDefault();
  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
//Load cart items on cart page load

if (document.querySelector("cart-items")) {
  displayCartItems();
}
