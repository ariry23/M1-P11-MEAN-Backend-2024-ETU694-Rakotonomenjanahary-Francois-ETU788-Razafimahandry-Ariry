const horaire = require('../models/horaire.model');

async function checkHourOfUserEmploye(vidempl, hoursDebut, hoursFin, dateResa){
    try{
        let numberDate =  dateResa.getDay();
        let usrHour = await  horaire.findOne(
            { 
                iduser : vidempl, 
                heureDebut : 
                { 
                    $gte : hoursDebut 
                }, 
                heureFin : 
                {
                    $lte :  heureFin
                }, 
                heureFin : 
                { 
                    $gte : hoursFin 
                },
                jour : /.*numberDate.*/
            } 
        );
        if(usrHour.iduser == undefined){
            throw new Error('Check another hours  our this date is weekend')
        }
    }catch(error){
        throw error;
    }
}