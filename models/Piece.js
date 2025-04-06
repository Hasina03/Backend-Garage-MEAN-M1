const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    compatibilites: [{
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
        prix: { type: Number, required: true },
        quantite_stock: { type: Number, required: true, default: 0 },
        seuil_alerte: { type: Number, default: 5 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Piece', pieceSchema);
