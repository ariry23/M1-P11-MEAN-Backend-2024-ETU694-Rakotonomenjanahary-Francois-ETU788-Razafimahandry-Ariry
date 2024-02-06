
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

module.exports = {
    addReservation,
    checkHourOfReservation
};