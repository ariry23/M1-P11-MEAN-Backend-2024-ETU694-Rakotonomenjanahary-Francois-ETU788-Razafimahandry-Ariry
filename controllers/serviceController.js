

const { request } = require('express');
const model = require('../models') ; 
const personnelService = require('../services/personnelService');
const User = model.user ;
const Service = model.service ; 
const Reservation = model.reservation ; 
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
            idempl: req.body.idempl,
            dateReservation: new Date(req.body.dateReservation) ,
         
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
    reserver
};