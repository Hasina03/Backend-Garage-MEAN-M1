const express = require('express');
const router = express.Router();
const{AddReparation,deleteReparationVehicules,getReparationVehicules}= require('../controllers/ReparationControllers');
const jwtAuth = require('../middlewares/jwtAuth');
router.post('/',jwtAuth('manager'),AddReparation);
router.get('/',getReparationVehicules);
router.delete('/:id',deleteReparationVehicules);

module.exports = router;
