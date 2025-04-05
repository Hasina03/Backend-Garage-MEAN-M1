const mongoose = require('mongoose');

const processusSchema = new mongoose.Schema({
    ordre: { type: Number, required: true },
    nom_etape: { type: String, required: true },
    pieces_possibles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }]
});

const prestationSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix_main_oeuvre: { type: Number, required: true },
    processus: [processusSchema]
});

module.exports = mongoose.model('Prestation', prestationSchema);

