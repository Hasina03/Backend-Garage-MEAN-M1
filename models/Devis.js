const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    mecanicien_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    vehicule_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicules',
        required: true
    },
    pieces_estimees: [ 
        {
            nom_piece: { type: String, required: true },
            quantite: { type: Number, required: true },
            prix_unitaire: { type: Number, required: true }
        }
    ],
    montant: { 
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: ['En attente', 'Accepté', 'Refusé', 'Payé'],
        default: 'En attente'
    },
    date_creation: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Devis', DevisSchema);
