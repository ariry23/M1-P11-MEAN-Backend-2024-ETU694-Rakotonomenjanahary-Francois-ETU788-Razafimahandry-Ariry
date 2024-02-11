var express = require('express');
var router = express.Router();
const personnelController = require('../controllers/personnelContoller');
router.get('/list', personnelController.list);
module.exports = router;
