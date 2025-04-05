const express = require('express');
const router = express.Router();
const ListeRendezVousController = require('../../controllers/mecanicien/ListeRendezVousController');
const jwtAuth = require('../../middlewares/jwtAuth');

router.get('/', jwtAuth("mecanicien"), ListeRendezVousController.getRendezVousMecanicien);

module.exports = router;
