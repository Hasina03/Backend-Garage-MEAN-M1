const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    nom: { type: String, required: true },  // Nom de la pièce (ex : Plaquette de frein)
    compatibilites: [{
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },  // Référence au modèle Vehicule
        prix: { type: Number, required: true },  // Prix pour cette compatibilité
        quantite_stock: { type: Number, required: true, default: 0 },  // Stock pour cette compatibilité
        seuil_alerte: { type: Number, default: 5 }  // Seuil d'alerte pour cette compatibilité
    }]
}, { timestamps: true });

module.exports = mongoose.model('Piece', pieceSchema);
