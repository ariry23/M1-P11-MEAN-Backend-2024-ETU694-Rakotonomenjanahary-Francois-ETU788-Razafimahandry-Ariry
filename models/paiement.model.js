var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    service: {
        type: String,
        required: true
    },
    nombrePersonne: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true,
    } , 
    receiver: {
        type: String,
        required: true,
    } , 
    montant: {
        type : Number,
        required: true 
    }
});
var paiement = new mongoose.model('paiements', schema);
module.exports = paiement;