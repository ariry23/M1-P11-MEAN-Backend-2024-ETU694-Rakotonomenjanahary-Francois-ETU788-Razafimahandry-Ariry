const mongoose = require("mongoose");

const schema = mongoose.Schema({
  id_: {
    type : String
  },
  idserv: {
    type : String
  },
  userid: {
    type : String
  },
  idempl:{
    type : String
  },
  montant:{
    type : Number
  },
  montantcommissionEmpl:{
    type : Number
  },
  dateCreatReservation: {
    type : Date,
    default: Date.now
  },
  dateheureDebutReservation: {
    type : Date
  },
  dateheureFinReservation: {
    type : Date
  },
})

var reservation = new mongoose.model('reservation', schema);

module.exports = reservation;