var mongoose = require('mongoose');
const Role = require('../models/user.model');
var schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    } , 
    solde: 
    {
        type : Number , 
        default: 60000
    }
});
var user = new mongoose.model('users', schema);
module.exports = user;