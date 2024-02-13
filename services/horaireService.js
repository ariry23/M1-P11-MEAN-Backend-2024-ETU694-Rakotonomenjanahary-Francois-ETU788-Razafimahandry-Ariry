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
                    $lte : "2024-02-13 07:30:00Z"
                }, 
                heureFin : 
                { 
                    $gte : "2024-02-13 09:30:00Z" 
                },
                jour : { $regex : '.*' + numberDate + '.*'}
            } 
        );
        const test = await  horaire.aggregate([
            {
                $project: {
                    iduser: '$iduser',
                    jour: '$jour',
                    heureDebut: {
                        $dateFromString: {
                            dateString: { $concat: ['1970-01-01T',"$heureDebut"] },
                            format: "%Y-%m-%dT%H:%M",
                            timezone: "+00:00"
                        }
                    },
                    heureFin: {
                        $dateFromString: {
                            dateString: {  $concat: ['1970-01-01T',"$heureFin"] },
                            format: "%Y-%m-%dT%H:%M",
                            timezone: "+00:00"
                        }
                    },
                }
            },
            {
                $match: {
                    iduser : vidempl, 
                    heureDebut: {
                        $lte: new Date("1970-01-01T"+hoursDebut+":00Z")
                    },
                    heureFin:{
                         $gte: new Date("1970-01-01T"+hoursFin+":00Z")
                    },
                    jour : { $regex : '.*' + numberDate + '.*'}
                }
            },
            {
                $project: {
                    _id: 1,
                    heureDebut: 1,
                    heureFin: 1,
                    iduser: 1,
                    jour: 1
                }
            }
        ])
        console.log(test)
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