const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.DATABASE_URL);
  const db = mongoose.connection;
  db.on('error', (err) => console.log(err));
  db.once('open', () => console.log('Connected to Mongodb'));
};
module.exports = connectDB;