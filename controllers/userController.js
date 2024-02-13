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

async function getAppointment(req, res){
  try{
     let messagev = await userService.getAppointment(req, res);
     res.status(200).send({ message: messagev });
  }
  catch(error){
    console.log(error);
    res.status(500).send(error.message); 
    return;
  }
}

async function getStatWEmpl(req, res){
  try{
     let result = await userService.getStatWEmpl(req, res);
     res.status(200).send({ result: result });
  }
  catch(error){
    console.log(error);
    res.status(500).send(error.message); 
    return;
  }
}


async  function getReservationPerDay(req, res){
  

  try{
    let result = await userService.getReservationPerDay(req, res);
    res.status(200).send({ result:  result });
 }
 catch(error){
   console.log(error);
   res.status(500).send(error.message); 
   return;
 }
}

async  function getReservationPerMonth(req, res){
  

  try{
    let result = await userService.getReservationPerMonth(req, res);
    res.status(200).send({ result:  result });
 }
 catch(error){
   console.log(error);
   res.status(500).send(error.message); 
   return;
 }
}


async  function reservationCAPerMonth(req, res){
  

  try{
    let result = await userService.reservationCAPerMonth(req, res);
    res.status(200).send({ result:  result });
 }
 catch(error){
   console.log(error);
   res.status(500).send(error.message); 
   return;
 }
}

async  function reservationCAPerDay(req, res){
  

  try{
      let result = await userService.reservationCAPerDay(req, res);
      res.status(200).send({ result:  result });
  }
  catch(error){
    console.log(error);
    res.status(500).send(error.message); 
    return;
  }
}

async function beneficePerMonth(req, res){
  try{
    let result = await userService.beneficePerMonth(req, res);
    res.status(200).send({ result:  result });
  }
  catch(error){
    console.log(error);
    res.status(500).send(error.message); 
    return;
  }
}

module.exports = {
  signup,
  signin, 
  getAppointment, 
  getStatWEmpl,
  getReservationPerDay,
  getReservationPerMonth,
  reservationCAPerDay,
  reservationCAPerMonth,
  beneficePerMonth
};