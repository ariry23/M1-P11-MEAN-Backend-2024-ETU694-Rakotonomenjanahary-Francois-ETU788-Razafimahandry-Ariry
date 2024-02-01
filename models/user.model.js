const mongoose = require("mongoose");

const User = mongoose.model(
  "Users",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String
  })
);

module.exports = User;