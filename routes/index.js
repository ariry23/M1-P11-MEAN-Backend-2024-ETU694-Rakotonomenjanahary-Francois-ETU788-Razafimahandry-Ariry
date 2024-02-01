var express = require('express');
var router = express.Router();
var authJwt = require('../middlewares/authJwt');
const cors = require("cors");

const app = express();
const testController = require('../controllers/testController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}); */ 

/* GET home page. */
router.get('/items', [authJwt.verifyToken] ,  testController.getAllItems);
module.exports = router;
