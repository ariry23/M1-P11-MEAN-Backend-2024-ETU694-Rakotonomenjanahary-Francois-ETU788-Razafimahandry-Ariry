const config = require('../configuration/auth.config');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const model = require('../models');
const userService = require('../services/userService');
const preferenceService = require('../services/preferenceService');
const Horaire = model.horaire;
const User = model.user;
const Service = model.service;
const Reservation = model.reservation;
async function signup(req, res) {
  try {
    let user = req.body;
    let resultMessage = await userService.registerUser(user);
    res.status(200).send({ message: resultMessage });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
};

async function signin(req, res) {
  console.log("session : " + req.session);
  console.log("tapitra");
  try {
    let token = await userService.loginUser(req.body);
    res.status(200).send({ token: token });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getAppointment(req, res) {
  try {
    let messagev = await userService.getAppointment(req, res);
    res.status(200).send({ message: messagev });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getStatWEmpl(req, res) {
  try {
    let result = await userService.getStatWEmpl(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}


async function getReservationPerDay(req, res) {


  try {
    let result = await userService.getReservationPerDay(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getReservationPerMonth(req, res) {


  try {
    let result = await userService.getReservationPerMonth(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}


async function reservationCAPerMonth(req, res) {


  try {
    let result = await userService.reservationCAPerMonth(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function reservationCAPerDay(req, res) {


  try {
    let result = await userService.reservationCAPerDay(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function beneficePerMonth(req, res) {
  try {
    let result = await userService.beneficePerMonth(req, res);
    res.status(200).send({ result: result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getResaByUser(req, res) {
  try {
    let result = await userService.getResaByUser(req, res);
    res.status(200).send({ "message": "Liste des reservations par employee", "data": result });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function addOrUpdateHoraire(req, res) {
  try {
    let message = await userService.addOrUpdateHoraire(req, res)
    res.status(200).send({ "message": message });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
};

async function addOrUpdatePref(req, res) {
  try {
    let message = await userService.addOrUpdatePref(req, res)
    res.status(200).send({ "message": message });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
};

async function getAllPreferences(req, res) {
  try {
    let message = await userService.getAllPreferences(req, res)
    res.status(200).send({ "data": message });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function findHoraireUser(req, res) {
  try {
    let iduser = req.body.iduser;
    let result = await Horaire.findOne({ 'iduser': iduser })
    res.status(200).send({ 'message': 'Horaire personnel', "data": result });
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getResaByCustomer(req, res) {
  try {
    let reservationList = await Reservation.aggregate([
      { $addFields: { "idempl": { $toObjectId: "$idempl" } } },

      {
        $lookup: {
          from: "users",
          localField: "idempl",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $project: {
          idempl: 1,
          idserv: 1,
          name: "$customer.username",
          email: "$customer.email",
          /*dateDebutResa: { 
              $dateToString :{
                  date:"$dateheureDebutReservation",
                  format: "%d-%m-%Y %H:%M"
              }
          },
          dateFinResa: { 
              $dateToString :{
                  date:"$dateheureFinReservation",
                  format: "%d-%m-%Y %H:%M"
              }
          }, */
        }
      },
      { $addFields: { "idserv": { $toObjectId: "$idserv" } } },
      {
        $lookup: {
          from: "services",
          localField: "idserv",
          foreignField: "_id",
          as: "services"
        }
      },
      {
        $unwind: "$service"
      },
      {
        $project: {
          idempl: 1,
          name: "$username",
          email: "$email",
          /* dateDebutResa: "$dateDebutResa",
           dateFinResa: "$dateFinResa" , */

        }
      },/*
      {
          $match: {
              userid : req.body.userid, 
          }
      },*/
    ]);






    //console.log(reservationList) ; 
    res.status(200).send({ "message": "Liste des reservations du client", "data": reservationList });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    return;
  }
}

async function getAllTaskDayByUser(req, res) {
  try {
    let result = await userService.getAllTaskDayByUser(req, res);
    res.status(200).send({ 'message': 'List task Day', "data": result });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}

async function getAllPreferencesClient(req, res) {
  try {
    let result = await userService.getAllPreferencesClient(req, res);
    res.status(200).send({ 'message': 'List pref', "data": result });
  } catch (error) {
    res.status(500).send(error.message);
    throw error;
  }
}

async function validPreference(req, res) {
  try {
    let message = await preferenceService.validPref(req.body._id, req.body.status);
    res.status(200).send({ 'message': message });
  } catch (error) {
    res.status(500).send(error.message);
    throw error;
  }
}

async function getResaByClient(req, res) {
  try {
    let data = await userService.getResaByClient(req);
    res.status(200).send({ 'message': 'Historique client', 'data': data });
  } catch (error) {
    res.status(500).send(error.message);
    throw error;
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
  beneficePerMonth,
  getResaByUser,
  addOrUpdateHoraire,
  findHoraireUser,
  getAllTaskDayByUser,
  getAllPreferencesClient,
  addOrUpdatePref,
  getAllPreferences,
  validPreference,
  getResaByCustomer,
  getResaByClient
};

