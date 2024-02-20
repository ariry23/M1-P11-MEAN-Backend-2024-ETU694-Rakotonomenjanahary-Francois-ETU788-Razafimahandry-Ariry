const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.service = require("./service.model");
db.reservation = require("./reservation.model");
db.horaire = require("./horaire.model");
db.paiement = require("./paiement.model");

db.ROLES = ["user", "role"];

module.exports = db;