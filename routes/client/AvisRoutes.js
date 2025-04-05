const express = require('express');
const router = express.Router();
const AvisController = require('../../controllers/client/AvisController');

router.post('/:id/avis', AvisController.ajouterAvis);
router.put('/:id/avis', AvisController.modifierAvis);
router.delete('/:id/avis', AvisController.supprimerAvis);

module.exports = router;
