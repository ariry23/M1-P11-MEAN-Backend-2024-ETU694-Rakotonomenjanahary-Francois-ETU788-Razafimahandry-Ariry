var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    amount : {
        type: ,
      
    },
    description: {
        type: String , 
        default:''
    },
});
var role = new mongoose.model('Paiements', schema);
module.exports = role;