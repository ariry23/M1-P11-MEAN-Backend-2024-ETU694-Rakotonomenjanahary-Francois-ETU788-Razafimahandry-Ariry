const mongoose = require("mongoose");

const schema = mongoose.Schema({
  iduser: {
    type : String
  },
  heureDebut: {
    type : String
  },
  heureFin:{
    type : String
  },
  jour: {
    type : String
  }
})

var horaire = new mongoose.model('horaire', schema);

module.exports = horaire;