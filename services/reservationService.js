
const Reservation = require('../models/reservation.model') ;

async function addReservation(reservation, dateDebutResa,  dateheureFinRes) {
    try {
        const resa  =  new Reservation({
            idserv : reservation.idserv,
            userid : reservation.userid,
            idempl : reservation.idemploye,
            dateheureFinReservation : dateheureFinRes,
            dateheureDebutReservation : dateDebutResa
        });
        await resa.save();
        return "Appointment Successfully";
    } catch (error) {
        throw error;
    }
}

async function checkHourOfReservation(vidempl, vdateDebutResa){
    try{
        var condition = { idempl :  vidempl,  dateDebutResa : { $lte :  vdateDebutResa }, dateFinResa : { $gte: vdateDebutResa }};
        const resa = Reservation.find(condition).count();
        console.log(resa)
        // if(resa != 0){
        //     throw new Error('Date or Time is already reserved. Please check another Time !!!'); 
        // }
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
        console.log('ilaina'+avgWEmpl);
        return avgWEmpl;
            
    }catch(error){
        throw error;
    }
}
module.exports = {
    addReservation,
    checkHourOfReservation,
    getTempsMoyenTravailParJour
};