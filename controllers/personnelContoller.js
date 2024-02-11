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
        res.status(200).send({ personnelList });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

module.exports = {
    list
};