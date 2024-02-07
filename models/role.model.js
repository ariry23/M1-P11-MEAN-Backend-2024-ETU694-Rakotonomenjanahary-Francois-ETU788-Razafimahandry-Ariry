var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
      
    },
    description: {
        type: String , 
        default:''
    },
});
var role = new mongoose.model('Roles', schema);
module.exports = role;