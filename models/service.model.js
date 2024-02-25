const mongoose = require("mongoose");
var schema = new mongoose.Schema({                  
    id_:{                   
        type : String                               
    } ,                 
    nom:{               
        type : String                                   
    } ,     
    prix: {                                                     
        type : String                                           
    } ,     
    commission: {       
        type : String   
    } ,     
    duree: {
        type : Number
    } ,     
    description: {
        type : String
    } ,     
    image: {
        type : String
    }       
});
var services = new mongoose.model('Services', schema);
module.exports = services;  