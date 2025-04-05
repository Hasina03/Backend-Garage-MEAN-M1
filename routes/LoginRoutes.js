const express=require('express');
const routes=express.Router();
const login=require('../controllers/LoginControllers');
routes.post('/',login);

module.exports=routes;