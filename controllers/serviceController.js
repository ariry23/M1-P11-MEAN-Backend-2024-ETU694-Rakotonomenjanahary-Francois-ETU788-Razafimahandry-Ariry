

const { request } = require('express');
const model = require('../models') ; 
const personnelService = require('../services/personnelService');
const User = model.user ;
const Service = model.service ; 
const Reservation = model.reservation ; 
const Paiement = model.paiement ; 
const server = require('../bin/www');
const WebSocket = require('ws');

async function list(req, res) {
    try { 
        let serviceList =  await Service.find({}) ;     
        res.status(200).send({ "message" : "Liste des services" , "data" : serviceList });    
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};


async function update(req, res) {
    try { 
        let service = await Service.findOne({"_id" : req.body._id}) ; 
        service.nom = req.body.nom ;    
        service.duree = req.body.duree ;    
        service.commission = req.body.commission ; 
        service.prix = req.body.prix ;
        await service.save() ; 
        res.status(200).send({ "message" : "Ce service a été modifié avec success"});
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

async function ajout(req, res) {
    try { 
        const newService = new Service({
            nom: req.body.nom,
            prix: req.body.prix,
            commission: req.body.commission , 
            duree : req.body.duree, 
            description : req.body.description , 
           // image : req.body.image
        });
        //console.log(req.file) ; 
        
        await newService.save(); 
        res.status(200).send({ "message" : "Service enregistré avec success! " });
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
     
        await Service.deleteOne({"_id" : req.params.id}) ; 
        res.status(200).send({ "message" : "service suprimé avec success" });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};


async function reserver(req, res) {
    try { 
        console.log(req.body.dateReservation) ; 
        const reservation = new Reservation({
            idserv : req.body.idserv,
            userid: req.body.userid,
            idempl: req.body.idemploye,
            dateReservation: new Date(req.body.dateReservation) ,
            nombrePersonne : req.body.nombrePersonne , 
        }) ; 

        console.log(req.body) ; 
        await reservation.save() ;
        res.status(200).send({ "message" : "reservation créé avec success"});
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};



async function pay(req, res) {
    try { 
        let user = await User.findOne({"_id" : req.body.userid}) ; 
        /* logique na paiement*/ 
        const paiement = new Paiement({
            nombrePersonne : req.body.nombrePersonne
        }) ; 
        await paiement.save() ;
        res.status(200).send({ "message" : "reservation créé avec success"});
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

async function offre(req, res) {
    try { 
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws) => {
            console.log('Client connected');
          
            ws.on('message', (message) => {
              console.log(`Received message: ${message}`);
          
              // Example: Broadcast the received message to all clients
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(message);
                }
              });
            });
          
            ws.on('close', () => {
              console.log('Client disconnected');
            });
          });
    }
    catch (error) {
      console.log(error);
      res.status(500).send(error.message); 
      return;
    }
};

async function listPay(req, res) {
    try { 
        console.log(req.body.dateReservation) ; 
        const reservation = new Reservation({
            idserv : req.body.idserv,
            userid: req.body.userid,
            idempl: req.body.idemploye,
            dateReservation: new Date(req.body.dateReservation) ,
            nombrePersonne : req.body.nombrePersonne , 
        }) ; 

        console.log(req.body) ; 
        await reservation.save() ;
        res.status(200).send({ "message" : "reservation créé avec success"});
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
    suprimer , 
    reserver , 
    pay , 
    offre
};