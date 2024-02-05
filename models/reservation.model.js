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
  dateCreatReservation: {
    type : Date,
    default: Date.now
  },
  dateReservation: {
    type : Date,
  },
  heureDebutReservation: {
    type : String
  },
  heureFinReservation: {
    type : String
  },
})

var reservation = new mongoose.model('reservation', schema);

module.exports = reservation;