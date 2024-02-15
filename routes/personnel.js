var express = require('express');
var router = express.Router();
const personnelController = require('../controllers/personnelContoller');
router.get('/list', personnelController.list);
router.post('/update', personnelController.update);
router.post('/ajout', personnelController.ajout);
router.delete('/delete/:id', personnelController.suprimer);
module.exports = router;
