var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    reservation: {
        type: String,
        required: true
    },
    utilisateur: {
        type: String,
        required: true,
    } , 
    destinataire: {
        type: String,
        required: true,
    } ,
});
var paiement = new mongoose.model('paiements', schema);
module.exports = paiement;