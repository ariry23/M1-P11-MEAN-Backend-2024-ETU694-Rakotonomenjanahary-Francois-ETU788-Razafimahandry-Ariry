const config = require('../configuration/auth.config');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const model = require('../models') ; 
const userService = require('../services/userService');
const User = model.user ;
const Role = model.role ; 
async function list(req, res) {
    try { 
        let role = await Role.findOne({"name" : "employee"}) ; 
        let personnelList =  await User.find({"role" : role._id}) ; 
        res.status(200).send({ "message" : "Liste du personnel" , "data" : personnelList });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};


async function update(req, res) {
    try { 
        let user = await User.findOne({"email" : req.body.email}) ; 
        user.username = req.body.username ; 
        user.email = req.body.email ;
        await user.save() ; 
        res.status(200).send({ "message" : "Cette personne a été modifié avec success"});
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

module.exports = {
    list , 
    update
};