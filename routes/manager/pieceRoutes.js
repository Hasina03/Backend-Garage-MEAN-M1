const express = require('express');
const router = express.Router();
const pieceController = require('../../controllers/manager/pieceController');

router.get('/', pieceController.getAllPiecesWithStock);
router.get('/:id/compatibilites', pieceController.getPieceCompatibilites);
router.put('/compatibilites/update', pieceController.updateCompatibilite);
router.patch('/compatibilites/add-stock', pieceController.addStockToCompatibilite);
router.post('/compatibilites/add', pieceController.addCompatibilite);
router.delete('/:pieceId/compatibilites/:vehiculeId', pieceController.deleteCompatibilite);

module.exports = router;
