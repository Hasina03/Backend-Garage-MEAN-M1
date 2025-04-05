const express = require('express');
const router = express.Router();
const { addRendezVous,updateStatutRdv,updateDateRdv,genererfacture, getRendezVous,getRendezVousByClientId, deleteRendezVous, updateRendezVous,getMecanicienForRendezVous,ajouterMecanicienARendezVous } = require('../controllers/Rendezvous/RendezVousControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const {getMecaniciens} = require('../controllers/UtilisateurConttrollers');


router.post('/', addRendezVous);
router.get('/', jwtAuth('manager'),getRendezVous);
router.post('/facture', genererfacture);
router.get('/mecanicien', jwtAuth('manager'),getMecaniciens);
router.get('/mecanicienrendezvous',jwtAuth('manager'),getMecanicienForRendezVous);
router.put('/:id/ajoutmecanicien', jwtAuth('manager'),ajouterMecanicienARendezVous);
router.get('/:clientId/client',getRendezVousByClientId);
router.delete('/:id', deleteRendezVous);
router.put('/:id', updateRendezVous);
router.put('/:id/status', updateStatutRdv);
router.put('/:id/dates', updateDateRdv);

module.exports = router;
