var express = require('express');
var router = express.Router();
const emailController = require('../controllers/emailController');
router.post('/send', emailController.sendMail);
module.exports = router;
