const config = require('../configuration/auth.config');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const model = require('../models') ; 
const userService = require('../services/userService');
const User = model.user ;
async function signup(req, res) {
    try { 
      let user = req.body ; 
      let resultMessage =  await userService.registerUser(user) ; 
      res.status(200).send({ message: resultMessage });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

async function signin(req, res) {
  console.log("session : " + req.session) ;
  console.log("tapitra")  ;
  try {
      let token =  await userService.loginUser(req.body) ; 
      res.status(200).send({ token: token});
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message); 
    return;
  }
}


module.exports = {
  signup,
  signin
};