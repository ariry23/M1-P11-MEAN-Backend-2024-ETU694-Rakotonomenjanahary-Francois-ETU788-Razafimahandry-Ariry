var express = require('express');
var router = express.Router();
const serviceController = require('../controllers/serviceController');
router.get('/list', serviceController.list);
router.post('/management/update', serviceController.update);
router.post('/management/ajout', serviceController.ajout);
router.delete('/management/delete/:id', serviceController.suprimer);
module.exports = router;
