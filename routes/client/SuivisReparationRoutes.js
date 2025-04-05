const express = require('express');
const router = express.Router();
const SuiviReparationsController = require('../../controllers/client/SuivisReparationController');

router.get('/:id/suivi-prestations', SuiviReparationsController.getSuiviReparations);

module.exports = router;
