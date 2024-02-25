var express = require('express');
var router = express.Router();
const serviceController = require('../controllers/serviceController');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Specify the filename
    }
  });
  
  // Multer upload configuration
  const upload = multer({ storage: storage });
router.get('/list', serviceController.list);
router.post('/management/update', serviceController.update);
router.post('/management/ajout',  upload.single('files') ,  serviceController.ajout);
router.delete('/management/delete/:id', serviceController.suprimer);
router.post('/reserver', serviceController.reserver);
router.post('/paiement/creer', serviceController.pay);
router.post('/offre', serviceController.offre);
router.post('/search', serviceController.search);
module.exports = router;
