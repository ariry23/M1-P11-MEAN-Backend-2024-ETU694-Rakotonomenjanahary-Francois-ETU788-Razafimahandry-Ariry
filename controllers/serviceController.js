

const { request } = require('express');
const model = require('../models') ; 
const personnelService = require('../services/personnelService');
const User = model.user ;
const Service = model.service ; 
const Reservation = model.reservation ; 
const Paiement = model.paiement ; 
const server = require('../bin/www');
const WebSocket = require('ws');
const nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Specify the filename
  }
});

const upload = multer({ storage: storage });
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
      if (!req.file) {
          return res.status(400).send('No file uploaded.');
      }

      // File is stored in req.file
      const uploadedFile = req.file;

      // Perform necessary logic with the uploaded file
      // For example, you can move the file to a different directory
      const newPath = 'uploads/' + uploadedFile.filename;
      fs.renameSync(uploadedFile.path, newPath);

      // Respond with success message
      res.status(200).send({ message: "File uploaded successfully.", filename: uploadedFile.filename });
  } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
  }
}



/*async function ajout(req, res) {
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
};*/


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
            dateheureDebutReservation: new Date(req.body.dateReservation) ,
            nombrePersonne : req.body.nombrePersonne , 
        }) ; 


        let user = await User.findOne({"_id" : req.body.userid }) ; 
        let service = await Service.findOne({"_id" : req.body.idserv}) ; 
        /* send mail logic */ 
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false , 
        
          auth: {
              user: 'ariryrazafimahandr@gmail.com',
              pass: 'soye jhww dmvi ubtl'
          } , 
          tls: {
            rejectUnauthorized: false 
          }
      });
      
      const mailOptions = {
        from: 'ariryrazafimahandr@gmail.com',
        to: user.email,
        subject: 'reservation du service ' + service.nom  ,
        text: 'Vous vennez de reserver le service ' + service.nom + ' pour le ' + new Date(req.body.dateReservation)
    };

    // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log('Error sending email:', error);
              res.send('Error sending email');
          } else {
              console.log('Email sent:', info.response);
              res.send('Email sent successfully');
          }
      });
      
      












        //console.log(req.body) ; 
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