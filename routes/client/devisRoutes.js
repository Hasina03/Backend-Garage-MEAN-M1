const express = require('express');
const router = express.Router();
const devisController = require('../../controllers/client/DevisController');

router.get('/options', devisController.getOptions);
router.post('/generer', devisController.generateDevis);

module.exports = router;
