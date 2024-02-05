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
        let idService = '65c124a54888444e9ae2b8c6' //req.body.idService;
        let idemploye = '1' //req.body.idemploye;
        let dateDebutResa = new Date(req.body.dateReservation)
        let hourBeginResa =  dateDebutResa.getHours()+':'+dateDebutResa.getMinutes()
        const serv = await servService.getServiceById(idService);
        dateDebutResa.setTime(dateDebutResa.getTime() + serv.duree*60*60*1000);
        let hourEndResa = dateDebutResa.getHours()+':'+dateDebutResa.getMinutes();
        var message = await reservationService.addReservation(resa, hourBeginResa, hourEndResa);
        return  message
        // 
        // let hourEndResa  = ;
        // let idemploye = req.body.idemploye;
        // await horaireService.ß(idemploye, '', '', dateDebutResa);
        // await  reservationService.getReservation(idemploye, dateDebutResa);
    }catch(error){
        throw error;
    }
}

module.exports = {
    registerUser,
    loginUser, 
    getAppointment
};