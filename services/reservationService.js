
const Reservation = require('../models/reservation.model') ;

async function addReservation(reservation, heureDebutResa, heureFinRes) {
    try {
        const resa  =  new Reservation({
            idserv : reservation.idserv,
            userid : reservation.userid,
            idempl : reservation.idemploye,
            dateReservation : reservation.dateReservation,
            heureDebutReservation : heureDebutResa,
            heureFinReservation : heureFinRes
        });
        await resa.save();
        return "Appointment Successfully";
    } catch (error) {
        throw error;
    }
}

async function checkHourOfReservation(vidempl, vdateDebutResa){
    try{
        var condition = { idempl :  vidempl,  dateDebutResa : { $gte :  vdateDebutResa }, dateFinResa : { $lte: vdateDebutResa }};
        const resa = Reservation.findOne(condition);
        if(resa.idempl != undefined){
            throw new Error('Date or Time is already reserved. Please check another Time !!!'); 
        }
    }catch(error){
        throw error;
    }
}

module.exports = {
    addReservation,
    checkHourOfReservation
};