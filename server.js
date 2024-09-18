const express = require("express");
const path = require("path");
const ejsLayout = require("express-ejs-layouts");
const passport = require('passport');
const session = require('express-session'); // Change this line
const dotenv = require('dotenv').config;
const fs = require('fs-extra');
const upload = require('express-fileupload');

dotenv();

const app = express();

const initializePassport = require('./config/passport.config');
initializePassport(passport);

const connectDB = require('./config/db.config');
const seed = require("./seed/seed");
connectDB();
seed();

const port = process.env.PORT || 5000;

app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(ejsLayout);
app.set("layout", "layouts/layout");

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  upload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

//* Directory for local upload
fs.ensureDir(path.resolve('public', 'uploads', 'products'))

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth.router'));
app.use('/dashboard', require('./routes/dashboard.router'));
app.use('/books', require('./routes/book.router'));
app.use('/cart', require('./routes/cart.router'));
app.use('/orders', require('./routes/order.router'));
app.use('/reviews', require('./routes/review.router'));
app.use('/admin/users', require('./routes/users.router'));

app.listen(port, () => console.log("Server listening to port: " + port));
