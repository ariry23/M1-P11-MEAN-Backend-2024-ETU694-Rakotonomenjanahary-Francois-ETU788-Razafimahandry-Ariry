const User = require('../models/user.model');
const Role = require('../models/role.model');
const reservationService = require('./reservationService');
const horaireService = require('./horaireService');
const preferenceService = require('./preferenceService')
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
            const role = await Role.findOne({ name: "customer" });
            console.log(role);
            newUser.role = role._id;
            await newUser.save();

            return 'User registered successfully';
        }
        throw new Error("Password and password confirmation don't match");
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
            console.log("user role id : " + existingUser.role);
            const userRole = await Role.findById(existingUser.role);
            const token = jwt.sign({ user: existingUser, role: userRole },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 3600, //in seconds
                });
            return token;
        }
        throw new Error("User Doesn't exists");

    } catch (error) {
        throw error;
    }
}

async function getAppointment(req, res) {
    try {
        let resa = req.body;
        let idService = req.body.idserv;
        let idemploye = req.body.idemploye;
        let date = new Date(req.body.dateReservation)
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        let dateResa = new Date(date.getTime() - userTimezoneOffset)
        let dateDebutResa = new Date(date.getTime() - userTimezoneOffset)
        console.log(dateDebutResa);
        let heureDebutResa = dateDebutResa.getHours() + ':' + dateDebutResa.getMinutes();
        let serv =  await preferenceService.getServiceById(idService, resa.userid);
        if (serv === null || serv === undefined) {
            serv = await servService.getServiceById(idService);
        }
    
        dateResa.setTime(dateResa.getTime() + serv.duree * 60 * 60 * 1000);

        let amount = serv.prix;
        let amountCommission = (amount * serv.commission) / 100;
        let hourEndResa = dateResa;
        let heureFinResa = dateResa.getHours() + ':' + dateResa.getMinutes();
        await reservationService.checkHourOfReservation(idemploye, dateDebutResa, hourEndResa)
        await horaireService.checkHourOfUserEmploye(idemploye, heureDebutResa, heureFinResa, dateDebutResa)
        var message = await reservationService.addReservation(resa, dateDebutResa, hourEndResa, amount, amountCommission);
        return message;
    } catch (error) {
        throw error;
    }
}

async function getStatWEmpl(req, res) {
    try {
        return await horaireService.getTempsMoyenTravailParJour();
        // return await reservationService.getTempsMoyenTravailParJour();
    } catch (error) {
        throw error;
    }
}

async function getReservationPerDay() {
    return await reservationService.numberReservationPerDay();
}

async function getReservationPerMonth() {
    return await reservationService.numberReservationPerMonth();
}

async function reservationCAPerDay() {
    return await reservationService.reservationCAPerDay();
}

async function reservationCAPerMonth() {
    return await reservationService.reservationCAPerMonth();
}

async function beneficePerMonth(req, res) {
    let data = req.body;
    let salaire = data.salaire;
    let loyer = data.loyer;
    let achat = data.piece;
    let divers = data.divers;
    let depense = salaire + loyer + achat + divers;
    return await reservationService.beneficePerMonth(depense);
}

async function getResaByUser(req, res) {
    try {
        let vidempl = req.body.idempl;
        return await reservationService.getResaByUser(vidempl);
    } catch (error) {
        throw error;
    }
}

async function getAllTaskDayByUser(req, res) {
    try {
        let vidempl = req.body.idempl;
        return await reservationService.getAllTaskDayByUser(vidempl);
    } catch (error) {
        throw error;
    }
}

async function addOrUpdateHoraire(req, res) {
    try {
        let rquest = req.body;
        if (rquest.jour == '') {
            throw new Error('Veuillez cocher un ou des jours !!!');
        }
        if (rquest.hourDebut > 23 || rquest.hourFin > 23) {
            throw new Error('Veuillez verifier l\'heure !!!');
        }
        if (rquest.minuteDebut > 59 || rquest.minuteDebut > 59) {
            throw new Error('Veuillez verifier les minutes !!!');
        }
        if (rquest.hourDebut >= rquest.hourFin) {
            throw new Error('Veuillez verifier les heures !!!');
        }
        return await horaireService.addOrUpdateHoraire(req, res);
    } catch (error) {
        throw error
    }
}

async function addOrUpdatePref(req, res) {
    try {
        return await preferenceService.addOrUpdatePref(req, res);
    } catch (error) {
        throw error
    }
}


async function getAllPreferences(req, res) {
    try {
        return await preferenceService.getAllPreferences(req, res);
    } catch (error) {
        throw error
    }
}
async function getAllPreferencesClient(req, res) {
    try {
        let vidempl = req.body.idclient;
        return await preferenceService.getAllPreferencesClient(vidempl);
    } catch (error) {
        throw error;
    }
}

async function getResaByClient(req, res) {
    try {
        let vidclient = req.body.idclient;
        return await reservationService.getResaByClient(vidclient);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAppointment,
    getStatWEmpl,
    getReservationPerDay,
    getReservationPerMonth,
    reservationCAPerDay,
    reservationCAPerMonth,
    beneficePerMonth,
    getResaByUser,
    addOrUpdateHoraire,
    getAllTaskDayByUser,
    getAllPreferencesClient,
    addOrUpdatePref,
    getAllPreferences,
    getResaByClient
};
