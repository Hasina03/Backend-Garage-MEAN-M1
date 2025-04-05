const express = require("express");
const router = express.Router();
const DefaultLayoutController = require('../../controllers/layout-frontend/DefaultLayoutController');

router.get("/", DefaultLayoutController.getPrestations);
router.get("/:id", DefaultLayoutController.getPrestationById);

module.exports = router;
