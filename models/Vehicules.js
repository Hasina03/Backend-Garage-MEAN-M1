const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
    vin: {
        type: String,
        unique: true,
        sparse: true // Permet des valeurs nulles si le VIN est inconnu
    },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    type_moteur: { type: String, enum: ['essence', 'diesel'], required: true },
    type_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule', required: true },
    date_ajout: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicule', vehiculeSchema);
