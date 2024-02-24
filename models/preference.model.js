const mongoose = require("mongoose");
var schema = new mongoose.Schema({

    id_:{
        type : String
    },
    iduser:{
        type : String
    },
    idserv:{
        type : String
    },
    idempl:{
        type : String
    },
    prix: {
        type : String
    },
    commission: {
        type : String
    },
    duree: {
        type : Number
    },
    status: {
        type : String
    }

});

var Preferences = new mongoose.model('Preferences', schema);

module.exports = Preferences;