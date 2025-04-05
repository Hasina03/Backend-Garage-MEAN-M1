const express=require('express');
const route=express.Router();
const jwtAuth=require('../middlewares/jwtAuth');

const{ createClient,getClient,updateRole,deleteClient}=require('../controllers/UtilisateurConttrollers');

route.get('/',getClient);

route.post('/',createClient);

route.put('/:id',jwtAuth('manager'), updateRole); 

route.delete('/:id',jwtAuth('manager'), deleteClient); 

module.exports=route;