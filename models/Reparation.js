const mongoose = require('mongoose');

const ReparationSchema = new mongoose.Schema({
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
    devis_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Devis',
        required: true
    },
    statut: {
        type: String,
        enum: ['En attente', 'En cours', 'Terminé'],
        default: 'En attente'
    },
    pieces_utilisees: [
        {
            nom_piece: { type: String, required: true },
            quantite: { type: Number, required: true },
            prix_unitaire: { type: Number, required: true }  
        }
    ],
    montant_total: {  
        type: Number,
        required: true
    },
    date_debut: {
        type: Date,
        required: true
    },
    date_fin_estimee: {
        type: Date,
        required: true
    }
}, { timestamps: true });

ReparationSchema.pre('save', function (next) {
    this.montant_total = this.pieces_utilisees.reduce((total, piece) => {
        return total + piece.quantite * piece.prix_unitaire;
    }, 0);
    next();
});

module.exports = mongoose.model('Reparation', ReparationSchema);
