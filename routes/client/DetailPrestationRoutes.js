const express = require("express");
const router = express.Router();
const prestationController = require('../../controllers/client/DetailPrestationController');

// Route pour récupérer une prestation par ID
router.get("/:id", prestationController.getPrestationById);

module.exports = router;
