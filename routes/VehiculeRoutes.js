const express=require('express');
const routes=express.Router();

const jwtAuth=require('../middlewares/jwtAuth');
const {addVehicule,deleteVehicule,getVehicule,getTypeVehicule}=require('../controllers/vehiculeControllers');
routes.get('/typevehicule',getTypeVehicule);
routes.post('/',jwtAuth(),addVehicule);
routes.delete('/:id',deleteVehicule);
routes.get('/',jwtAuth(),getVehicule);

module.exports=routes;