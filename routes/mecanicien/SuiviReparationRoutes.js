const express = require("express");
const router = express.Router();
const jwtAuth = require('../../middlewares/jwtAuth');
const { getDetailsRendezVous, updateStatutPrestation } = require("../../controllers/mecanicien/SuiviReparationController");

router.get("/:id",jwtAuth('mecanicien'), getDetailsRendezVous);
router.put("/prestation/:id",jwtAuth('mecanicien'), updateStatutPrestation);

module.exports = router;
