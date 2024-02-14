const config = require('../configuration/auth.config');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const model = require('../models') ; 
const userService = require('../services/userService');
const personnelService = require('../services/personnelService');
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
        let user = await User.findOne({"_id" : req.body._id}) ; 
        console.log(user);
        console.log(req.body.username);
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


async function ajout(req, res) {
    try { 
        let resultMessage =  await personnelService.ajout(req) ; 
        res.status(200).send({ "message" : resultMessage });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};


async function suprimer(req, res) {
    try { 
        console.log(req.params) ; 
     
        let resultMessage =  await User.deleteOne({"_id" : req.params.id}) ; 
        res.status(200).send({ "message" : resultMessage });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

module.exports = {
    list , 
    update , 
    ajout , 
    suprimer
};