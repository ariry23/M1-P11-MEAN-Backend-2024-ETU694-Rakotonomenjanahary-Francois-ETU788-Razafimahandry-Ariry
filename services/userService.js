const User = require('../models/user.model');
const reservationService = require('./reservationService');
const horaireService =  require('./horaireService');
const servService = require('./servService');
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require('../configuration/auth.config');
async function registerUser(req, res) {
    try {
        const user = req;

        const email = user.email;
        const existingUser = await User.findOne({ email: email });
        if (existingUser != null) {
            throw new Error('User with this email already exists');
        }
        if (user.password === user.confirmPassword) {
            const newUser = new User({
                email: user.email,
                username: user.username,
                password: bcrypt.hashSync(user.password, 8)
            });
            await newUser.save();
            return 'User registered successfully';
        }
        throw new Error("Password and password confirmation don''t match");
    } catch (error) {
        throw error;
    }
}

async function loginUser(req, res) {
    try {






        const existingUser = await User.findOne({ username: req.username });
        if (existingUser === null) {
            throw new Error("User Doesn't exists");
        }

        var passwordIsValid = bcrypt.compareSync(
            req.password,
            existingUser.password
        );
        if (passwordIsValid) {
            const token = await jwt.sign({ id: existingUser.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 3600, // 24 hours
                });
            return token;
        }
        throw new Error("User Doesn't exists");

    } catch (error) {
        throw error;
    }
}

async function getAppointment (req, res){
    try{
        let resa = req.body;
        let idService = req.body.idserv;
        let idemploye = req.body.idemploye;
        let date = new Date(req.body.dateReservation)
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        let dateResa = new Date(date.getTime()-userTimezoneOffset)
        let dateDebutResa = new Date(date.getTime()-userTimezoneOffset)
        console.log(dateDebutResa);
        const serv = await servService.getServiceById(idService);

        dateResa.setTime(dateResa.getTime() + serv.duree*60*60*1000);

        let  amount = serv.prix;
        let amountCommission = (amount*serv.commission)/100;
        let hourEndResa = dateResa;
        await  reservationService.checkHourOfReservation(idemploye,dateDebutResa)
        await horaireService.checkHourOfUserEmploye(idemploye, '', '', dateDebutResa)
        var message = await reservationService.addReservation(resa, dateDebutResa, hourEndResa, amount, amountCommission);
        return  message
        // 
        // let hourEndResa  = ;
        // let idemploye = req.body.idemploye;
        // await  reservationService.getReservation(idemploye, dateDebutResa);
    }catch(error){
        throw error;
    }
}

async function getStatWEmpl(req, res){
    try{
        return await reservationService.getTempsMoyenTravailParJour();
    }catch(error){
        throw error;
    }
}

async function getReservationPerDay(){
    return await reservationService.numberReservationPerDay();
}

async function getReservationPerMonth(){
    return await reservationService.numberReservationPerMonth();
}

async function reservationCAPerDay(){
    return await reservationService.reservationCAPerDay();
}

async function reservationCAPerMonth(){
    return await reservationService.reservationCAPerMonth();
}

module.exports = {
    registerUser,
    loginUser, 
    getAppointment,
    getStatWEmpl, 
    getReservationPerDay,
    getReservationPerMonth,
    reservationCAPerDay,
    reservationCAPerMonth
};