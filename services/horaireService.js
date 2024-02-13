const horaire = require('../models/horaire.model');

async function checkHourOfUserEmploye(vidempl, hoursDebut, hoursFin, dateResa){
    try{
        var numberDate =  dateResa.getDay();
        console.log(numberDate)
        var usrHour = await  horaire.findOne(
            { 
                iduser : vidempl, 
                heureDebut : 
                { 
                    $lte : '7h30' 
                }, 
                heureFin : 
                { 
                    $lt : '9h30' 
                },
                jour : { $regex : '.*' + numberDate + '.*'}
            } 
        );

        // db.table.find({
        //     test: "a",
        //     test1: "a",
        //     test: { $regex: /.*/ }
        //     }, {
        //     _id: 1,
        //     test: 1
        //     })
        console.log('userH : ' + usrHour)
        // if(usrHour == null){
        //     throw new Error('Check another hours  our this date is weekend')
        // }

        
    }catch(error){
        throw error;
    }
}

module.exports= {
    checkHourOfUserEmploye
}