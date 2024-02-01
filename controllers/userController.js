const config = require('../configuration/auth.config');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const model = require('../models') ; 
const User = model.user ;
const signup = (req, res) => {
  if (req.password === req.confirmPassword) {
    try {
      let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: 'admin'
      }
      );
      user.save();
      res.send({ message: "User was registered successfully!" });
    }
    catch (error) {
      res.status(500).send({ message: error.message });
      return;
    }


    /*user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            res.send({ message: "User was registered successfully!" });
          });
        }); 
      }
    }); */
  }
  else {
    res.status(400).send({ message: "Passwords do not match" });
  }
};

const signin = (req, res) => {
  let cryptedPassword = bcrypt.hashSync("ariry", 8);
  var passwordIsValid = bcrypt.compareSync(
    "test",
    cryptedPassword
  );

  const token = jwt.sign({ id: 1 },
    config.secret,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 3600, // 24 hours
    });
  res.json({ message: 'password is valid    ' + passwordIsValid + "token*** : " + token, token: token });
}


module.exports = {
  signup,
  signin
};