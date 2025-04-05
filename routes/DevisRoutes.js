const express = require('express');
const router = express.Router();
const {addDevis, getDevis,deleteDevis} = require('../controllers/DevisControllers');
const jwtAuth = require('../middlewares/jwtAuth');


router.post('/',jwtAuth('manager'),addDevis);
router.get('/',getDevis);
router.delete('/:id',deleteDevis);

module.exports = router;
