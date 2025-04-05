const express=require('express');
const routes=express.Router();

const jwtAuth=require('../middlewares/jwtAuth');
const {addVehicule,deleteVehicule,getVehicule}=require('../controllers/vehiculeControllers');
routes.post('/',jwtAuth(),addVehicule);
routes.delete('/:id',deleteVehicule);
routes.get('/',jwtAuth(),getVehicule);

module.exports=routes;