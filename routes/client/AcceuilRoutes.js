const express = require("express");
const router = express.Router();
const AcceuilController = require("../../controllers/client/AcceuilController");

router.get("/", AcceuilController.getAccueilPrestations);

module.exports = router;
