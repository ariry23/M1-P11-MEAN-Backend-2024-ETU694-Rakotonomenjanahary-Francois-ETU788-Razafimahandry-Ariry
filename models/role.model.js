const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    iduser : String,
    name : String

  })
);

module.exports = Role;