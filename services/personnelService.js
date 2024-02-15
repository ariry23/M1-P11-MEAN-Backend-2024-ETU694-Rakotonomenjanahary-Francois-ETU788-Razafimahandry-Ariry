const User = require('../models/user.model');
const Role = require('../models/role.model');
var bcrypt = require("bcryptjs");
const config = require('../configuration/auth.config');
var bcrypt = require("bcryptjs");
async function ajout(req, res) {
    try {
        const user = req.body;
        const email = user.email;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        if (user.password === user.confirmPassword) {
            const newUser = new User({
                email: user.email,
                username: user.username,
                password: bcrypt.hashSync(user.password, 8)
            });
            const role = await Role.findOne({name : "employee"}) ; 
            newUser.role = role._id ; 
            await newUser.save();

            return 'Personnel registered successfully';
        }
        throw new Error("Password and password confirmation don't match");
    } catch (error) {
        throw error;
    }
}

module.exports = {
    ajout
};