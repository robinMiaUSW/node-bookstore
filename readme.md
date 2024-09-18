# Bookstore Project

This is a basic Bookstore application built using Express.js, EJS for templating, MongoDB with Mongoose for database interactions, Bcrypt for password hashing, and Passport.js for user authentication. Stripe is used for payment processing.

## Features

- User authentication with Passport.js (login, register)
- Product management (create, update, delete)
- File upload for product images
- Secure payments integration using Stripe
- Fully responsive UI using Bootstrap

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (installed locally or using MongoDB Atlas)
- Stripe account for payment processing

## Installation & Setup

### Step 1: Install Dependencies

Run the following command to install all project dependencies:
npm install

### Step 2: Set Up Environment Variables

1. Create a `.env` file by copying the provided `.env-example` file:
   cp .env-example .env

2. Open the `.env` file and update it with your MongoDB and Stripe credentials:
   MONGODB_URI=mongodb://localhost:27017/your-database
   SESSION_SECRET=your-session-secret
   STRIPE_PUBLISHABLE_KEY=your-publishable-key
   STRIPE_SECRET_KEY=your-secret-key

### Step 3: Run the Application

Start the application with:
npm start

Alternatively, if you're in development mode and want to use auto-reloading with `nodemon`, run:
npm run dev

The application will be running at http://localhost:3000.

## Available Scripts

- Start the server: npm start
- Start in development mode: npm run dev
