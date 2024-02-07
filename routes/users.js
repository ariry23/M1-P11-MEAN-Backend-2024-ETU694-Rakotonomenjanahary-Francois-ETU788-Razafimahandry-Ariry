var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.post('/reservation', userController.getAppointment);
router.get('/statWempl', userController.getStatWEmpl);
module.exports = router;
