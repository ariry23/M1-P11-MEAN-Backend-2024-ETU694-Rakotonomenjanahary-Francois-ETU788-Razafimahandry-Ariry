const horaire = require('../models/horaire.model');

async function checkHourOfUserEmploye(vidempl, hoursDebut, hoursFin, dateResa){
    try{
        var numberDate =  dateResa.getDay();
        console.log(numberDate)
        const usrHour = await  horaire.aggregate([
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
        console.log(usrHour)
        if(usrHour.length == 0){
            throw new Error('Check another hours  our this date is weekend')
        }

        
    }catch(error){
        throw error;
    }
}


async function getTempsMoyenTravailParJour(){
    try {
        // const timeAvgW = await horaire.aggregate([
        //     { $addFields: { "userId": { $toObjectId: "$iduser" }}},
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "userId",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     {
        //         $unwind: "$user"
        //     },
        //     {
        //         $project: {
        //             iduser: 1,
        //             name: "$user.username",
        //             heureDebut: 1,
        //             heureFin: 1
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "reservations",
        //             localField: "iduser",
        //             foreignField: "idempl",
        //             as: "reservations"
        //         }
        //     },
        //     {
        //         $unwind: "$reservations"
        //     },
        //     {
        //         $project: {
        //             id_user: 1,
        //             idempl:"$reservations.idempl",
        //             username: "$name",
        //             date: {
        //                 $dateToString: {
        //                     date: "$reservations.dateheureFinReservation",
        //                     format: "%Y-%m-%d"
        //                 }
        //             },
        //             heureDebut: {
        //                 $dateFromString: {
        //                     dateString: { $concat: ['1970-01-01T',"$heureDebut"] },
        //                     format: "%Y-%m-%dT%H:%M",
        //                     timezone: "+00:00"
        //                 }
        //             },
        //             heureFin: {
        //                 $dateFromString: {
        //                     dateString: { $concat: ['1970-01-01T',"$heureFin"] },
        //                     format: "%Y-%m-%dT%H:%M",
        //                     timezone: "+00:00"
        //                 }
        //             },
        //             dateDebutResa: "$reservations.dateheureDebutReservation",
        //             dateFinResa: "$reservations.dateheureFinReservation"
        //         }
        //     },
        //     {
        //         $project: {
        //             id_user: 1,
        //             id_empl: "$idempl",
        //             username: "$username",
        //             date: 1,
        //             resaTime: {
        //                 $dateDiff: {
        //                     startDate: "$dateDebutResa",
        //                     endDate: "$dateFinResa",
        //                     unit: "minute"
        //                 }
        //             },
        //             horaireTime: {
        //                 $dateDiff: {
        //                     startDate: "$heureDebut",
        //                     endDate: "$heureFin",
        //                     unit: "minute"
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 id_user: "$id_empl",
        //                 username: "$username",
        //                 date: "$date"
        //             },
        //             totalResaTime: {
        //                 $sum: "$resaTime"
        //             },
        //             totalHoraireTime: { $avg : "$horaireTime" }
                    
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             id_user: "$_id.id_user",
        //             username: "$_id.username",
        //             date: "$_id.date",
        //             avg: {
        //                 // $round: {
        //                     $divide: [
        //                         "$totalResaTime",
        //                         "$totalHoraireTime"
        //                     ]
        //                 // }
        //             }
        //         }
        //     },
            
        // ]);

        const time = await horaire.aggregate([
            { $addFields: { "userId": { $toObjectId: "$iduser" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    iduser: 1,
                    name: "$user.username",
                    heureDebut: {
                        $dateFromString: {
                            dateString: { $concat: ['1970-01-01T',"$heureDebut"] },
                            format: "%Y-%m-%dT%H:%M",
                            timezone: "+00:00"
                        }
                    },
                    heureFin: {
                        $dateFromString: {
                            dateString: { $concat: ['1970-01-01T',"$heureFin"] },
                            format: "%Y-%m-%dT%H:%M",
                            timezone: "+00:00"
                        }
                    },
                    jour :{
                        $split: ["$jour", ","]
                    },
                }
            },
            {
                $project: {
                    iduser: 1,
                    username: "$name",
                    heure: {
                        $dateDiff: {
                            startDate: "$heureDebut",
                            endDate: "$heureFin",
                            unit: "hour"
                        }
                    },
                    nombreJour:{
                        $size: "$jour" 
                    },
                    AvgWEmpl: {
                        $round:{
                            $divide :[
                                {
                                    $multiply:[
                                        {
                                            $multiply:[
                                                {
                                                    $dateDiff: {
                                                        startDate: "$heureDebut",
                                                        endDate: "$heureFin",
                                                        unit: "hour"
                                                    }
                                                },
                                                {
                                                    $size: "$jour" 
                                                }
                                                
                                            ]
                                        },
                                        52
                                    ]
                                },
                                12
                            ]
                        }
                        
                    },
                }
            },
        ]);
        
        return time;
    } catch (error) {
        throw error;
    }
}
module.exports= {
    checkHourOfUserEmploye,
    getTempsMoyenTravailParJour
}