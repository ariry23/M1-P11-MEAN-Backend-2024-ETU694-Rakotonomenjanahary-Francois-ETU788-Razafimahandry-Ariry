const model = require('../models') ; 
const User = model.user ;
const Service = model.service ; 
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
async function ajout(req, res) {
    try { 
        const newService = new Service({
            dateReservation: new FormControl(new Date().toISOString().substring(0, 10) , Validators.required),
            nombrePersonne: new FormControl(1, [Validators.required , Validators.max(5)] ),
            heureDebut: new FormControl(null , Validators.required), 
            employe : new FormControl("")
          
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



module.exports = {
    list , 
    ajout , 
};