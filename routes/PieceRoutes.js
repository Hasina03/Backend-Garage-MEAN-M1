const express = require('express');
const router = express.Router();
const { addPiece, getPieces, deletePiece } = require('../controllers/Stock_piece/PieceControllers');
const jwtAuth = require('../middlewares/jwtAuth');

router.post('/', addPiece); 
router.get('/', getPieces);  
router.delete('/:id', jwtAuth('manager'), deletePiece); 

module.exports = router;
