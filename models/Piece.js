const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    variantes: [{
        type_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule', required: true },
        prix: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Piece', pieceSchema);
