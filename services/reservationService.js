
const Reservation = require('../models/reservation.model') ;

async function addReservation(reservation, dateDebutResa,  dateheureFinRes, amount, amountCommission , nbPersonne) {
    try {
        const resa  =  new Reservation({
            idserv : reservation.idserv,
            userid : reservation.userid,
            idempl : reservation.idemploye,
            montant : amount,
            montantcommissionEmpl : amountCommission,
            dateheureFinReservation : dateheureFinRes,
            dateheureDebutReservation : dateDebutResa , 
            nombrePersonne : nbPersonne

        });
        await resa.save();
        return "Appointment Successfully";
    } catch (error) {
        throw error;
    }
}

async function checkHourOfReservation(vidempl, vdateDebutResa, vdateFinResa){
    try{
       // var condition = { idempl :  vidempl,  dateDebutResa : { $lte :  vdateDebutResa }, dateFinResa : { $gte: vdateDebutResa }};
        var condition = {
            idempl :  vidempl,  
            
            $or : [
                {
                    dateheureDebutReservation: {
                        $gte: vdateDebutResa,
                        $lte: vdateFinResa
                    },
                },
                {
                    dateheureFinReservation: {
                        $gte: vdateDebutResa,
                        $lte: vdateFinResa
                    }
                }
            ]
        }
        console.log(vdateDebutResa)
        console.log(vdateFinResa)
        const resa = await Reservation.find(condition).count();
        console.log(resa)
        if(resa != 0){
            throw new Error('Date or Time is already reserved. Please check another Time !!!'); 
        }
    }catch(error){
        throw error;
    }
}

async function getTempsMoyenTravailParJour(){
    try{
        // [
        //     {
        //     "_id": 1,
        //     "loginTime": ISODate("2024-02-07T10:00:00Z"),
        //     "logoutTime": ISODate("2024-02-07T12:30:00Z")
        //     },
        //     {
        //     "_id": 2,
        //     "loginTime": ISODate("2024-02-07T11:00:00Z"),
        //     "logoutTime": ISODate("2024-02-07T13:00:00Z")
        //     },
        //     {
        //     "_id": 1,
        //     "loginTime": ISODate("2024-02-07T14:00:00Z"),
        //     "logoutTime": ISODate("2024-02-07T16:00:00Z")
        //     }
        // ]

        // const avgWEmpl =  await Reservation.aggregate([
        //     {
        //         $group: {
        //             _id: {idempl :"$idempl", $dateToString:{format: "%Y-%m-%d", date: "$dateheureDebutReservation"}},
        //             avg_hours: {
        //                 $avg: {
        //                     $dateDiff: {
        //                         startDate: "$dateheureDebutReservation",
        //                         endDate: "$dateheureFinReservation",
        //                         unit: "hour"
        //                     }
        //             }
        //             }
        //         }
        //     }
        // ]);

        const avgWEmpl =  await Reservation.aggregate([
            {
                $lookup: {
                    from : "users",
                    localField: "idempl",
                    foreignField: "_id",
                    as: "empl"
                }
            },
            {
                $group: {
                    _id: { idempl :"$idempl", date:{ $dateToString:{format: "%Y-%m-%d", date: "$dateheureDebutReservation"}}},
                    avg_hours: {
                        $avg: {
                            $dateDiff: {
                                startDate: "$dateheureDebutReservation",
                                endDate: "$dateheureFinReservation",
                                unit: "hour"
                            }
                        }
                    }
                }
            }
        ]);
        // console.log(avgWEmpl);
        return avgWEmpl;
            
    }catch(error){
        throw error;
    }
}

async function numberReservationPerDay(){
    try
    {
        const response = await Reservation.aggregate([
            // Créer un champ date qui extrait l'année, le mois et le jour de la date de réservation
            { $addFields: { date: { $dateToString: { format: "%Y-%m-%d", date: "$dateheureDebutReservation" } } } },
            // Regrouper les documents par le champ date et compter le nombre de documents dans chaque groupe
            { $group: { _id: "$date", numberResa: { $sum: 1 } } },
            // Trier les groupes par le champ _id dans l'ordre croissant
            { $sort: { _id: 1 } }
        ]);
        //console.log(response);
        return response;
    }catch(error){
        throw error;
    }
}


async function numberReservationPerMonth(){
    try
    {
        const response = await Reservation.aggregate([
            // Créer un champ month qui extrait l'année et le mois de la date de réservation
            { $addFields: { month: { $dateToString: { format: "%m-%Y", date: "$dateheureDebutReservation" } } } },

            // Regrouper les documents par le champ month et compter le nombre de documents dans chaque groupe
            { $group: { _id: "$month", numberResa: { $sum: 1 }} },

            // Trier les groupes par le champ _id dans l'ordre croissant
            { $sort: { _id: 1 } }
        ]);
        console.log(response);
        return response;
    }catch(error){
        throw error;
    }
}

async function reservationCAPerDay(){
    try
    {
        const response = await Reservation.aggregate([
            // Créer un champ date qui extrait l'année, le mois et le jour de la date de réservation
            { $addFields: { date: { $dateToString: { format: "%Y-%m-%d", date: "$dateheureDebutReservation" } } } },
            // Regrouper les documents par le champ date et compter le nombre de documents dans chaque groupe
            { $group: { _id: "$date", CA: { $sum: "$montant" } } },
            // Trier les groupes par le champ _id dans l'ordre croissant
            { $sort: { _id: 1 } }
        ]);
        //console.log(response);
        return response;
    }catch(error){
        throw error;
    }
} 

async function reservationCAPerMonth(){
    try
    {
        const response = await Reservation.aggregate([
            // Créer un champ month qui extrait l'année et le mois de la date de réservation
            { $addFields: { month: { $dateToString: { format: "%m-%Y", date: "$dateheureDebutReservation" } } } },

            // Regrouper les documents par le champ month et somme le montant de documents dans chaque groupe
            { $group: { _id: "$month", CA: { $sum: "$montant" }} },

            // Trier les groupes par le champ _id dans l'ordre croissant
            { $sort: { _id: 1 } }
        ]);
        console.log(response);
        return response;
    }catch(error){
        throw error;
    }
}

async function beneficePerMonth(depense){
    try {
        
        const benefice = await Reservation.aggregate([
            // Créer un champ month qui extrait l'année et le mois de la date de réservation
            { $addFields: { month: { $dateToString: { format: "%m-%Y", date: "$dateheureDebutReservation" } } } },
            // group  by date 
            {
                $group: { _id: "$month",
                    // Calculate the difference between the maximum and minimum values of montant
                    CA: {$sum: "$montant"}
                }
            },
            
            // Calculate the difference between total and a depense
            {
                $addFields: {
                    benefice: {$subtract: ["$CA", depense]}
                }
            },
            // Trier les groupes par le champ _id dans l'ordre croissant
            { $sort: { _id: 1 } }
        ]);

        console.log(benefice);
        return benefice;
    } catch (error) {
        throw error;
    }
}

async function getResaByUser(vidempl){
    try {
        console.log(vidempl);
        const Resa = await Reservation.aggregate([
            { $addFields: { "userId": { $toObjectId: "$userid" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
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
                    name: "$customer.username",
                    email:"$customer.email",
                    dateDebutResa: { 
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
                    },
                    dateResa : "$dateheureDebutReservation",
                }
            },
            {
                $match: {
                    idempl : vidempl, 
                    //dateResa :{
                        //$eq : vdateResa
                    //}
                }
            },
        ]);

        return Resa;
    } catch (error) {
        throw error;
    }
}
async function getResaByClient(vclient){
    try {
        console.log(vclient);
        const histo = await Reservation.aggregate([
            { $addFields: { "idserv": { $toObjectId: "$idserv" }}},
            {
                $lookup: {
                    from: "services",
                    localField: "idserv",
                    foreignField: "_id",
                    as: "serv"
                }
            },
            {
                $unwind: "$serv"
            },
            {
                $project: {
                    _id: 1,
                    userid: 1,
                    idempl: 1,
                    idserv: 1,
                    nombrePersonne: 1,
                    statusPaiement: 1,
                    nameServ: "$serv.nom",
                    prixServ :  "$serv.prix" , 
                    montant: 1,
                    dateDebutResa: { 
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
                    },
                    dateResa : "$dateheureDebutReservation",
                    dateCreatReservation: 1
                }
            },
            { $addFields: { "idempl": { $toObjectId: "$idempl" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "idempl",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            {
                $unwind: "$employee"
            },
            {
                $project: {
                    nombrePersonne: "$nombrePersonne",
                    statusPaiement: "$statusPaiement",
                    iduser: "$userid",
                    idempl: "$idempl",
                    idserv: "$idserv",
                    nameServ: "$nameServ",
                    name: "$employee.username",
                    montant:"$montant",
                    dateDebutResa: "$dateDebutResa",
                    dateFinResa: "$dateFinResa",
                    dateResa : "$dateResa",
                    dateCreatReservation: '$dateCreatReservation' , 
                    prixServ : '$prixServ'
                }
            },
            {
                $match: {
                    iduser : vclient, 
                    
                }
            },
        ]);

        return histo;
    } catch (error) {
        throw error;
    }
}
async function getAllTaskDayByUser(vidempl){
    try {
        console.log(new Date())
        let date = new Date();
        var vdateResaString = date.toISOString().slice(0, 10);
        const Resa = await Reservation.aggregate([
            { $addFields: { "userId": { $toObjectId: "$userid" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
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
                    name: "$customer.username",
                    email:"$customer.email",
                    dateDebutResa: { 
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
                    },
                    mntCom:{
                            $divide :[
                                {
                                    $multiply : [ 
                                        "$montantcommissionEmpl" , 100
                                    ]
                                }, 
                                "$montant"
                            ]
                    },
                    
                    dateResa : { 
                        $dateToString :{
                            date:"$dateheureFinReservation",
                            format: "%Y-%m-%d"
                        }
                    },
                }
            },
            {
                $match: {
                    idempl : vidempl, 
                    dateResa :{
                        $eq : vdateResaString
                    }
                }
            },
        ]);

        return Resa;
    } catch (error) {
        throw error;
    }
}


async function getResaByUser(vuserid){
    try {
        console.log(new Date())
        let date = new Date();
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        let vdateResa = new Date(date.getTime()-userTimezoneOffset)
        const Resa = await Reservation.aggregate([
            { $addFields: { "userId": { $toObjectId: "$userid" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $unwind: "$customer"
            },
            {
                $project: {
                    userid: 1,
                    idempl: 1,
                    name: "$customer.username",
                    email:"$customer.email",
                    dateDebutResa: { 
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
                    },
                    dateResa : "$dateheureDebutReservation",
                }
            },
            {
                $match: {
                    idempl : vuserid, 
                    
                }
            },
        ]);
        return Resa;
    } catch (error) {
        throw error;
    }
}


            
module.exports = {
    addReservation,
    checkHourOfReservation,
    getTempsMoyenTravailParJour,
    numberReservationPerDay,
    numberReservationPerMonth,
    reservationCAPerDay,
    reservationCAPerMonth,
    beneficePerMonth,
    getResaByUser,
    getAllTaskDayByUser,
    getResaByClient
};
