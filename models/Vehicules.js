const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    type_moteur: { type: String, enum: ['essence', 'diesel'], required: true },
    type_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule', required: false },
    type_vehicule_autre: { type: String, required: false },
    date_ajout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicule', vehiculeSchema);
