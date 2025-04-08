        const mongoose = require('mongoose');

        const RendezVousSchema = new mongoose.Schema({
            client_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Utilisateur',
                required: true
            },
            mecanicien_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Utilisateur',
                required: false
            },
            vehicule_enregistrer: {  
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Vehicule', 
                required: false 
            },
            vehicule_id: {
                modele: { type: String },
                annee: { type: Number},
                marque: { type: String},
                type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeVehicule'},
                type_moteur: {
                    type: String,
                    enum: ['essence', 'diesel'],
                    required: [false, "Le type de moteur est requis"]
                }
            },
            date_rdv: {
                type: Date,
                required: true
            },
            statut: {
                type: String,
                enum: ['En attente', 'Confirmé', 'Annulé', 'Terminé'],
                default: 'En attente'
            },
            prestations: [{
                prestation_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Prestation',
                    required: true
                },
                statuts: {
                    En_attente: { type: Date, default: Date.now },
                    En_cours: { type: Date },
                    Annulé: { type: Date },
                    Terminé: { type: Date }
                }
            }],
            avis_client: {
                note: {
                    type: Number,
                    min: 1,
                    max: 5,
                    required: false
                },
                commentaire: {
                    type: String,
                    trim: true,
                    required: false
                }
            }
        }, { timestamps: true });

        module.exports = mongoose.model('RendezVous', RendezVousSchema);
