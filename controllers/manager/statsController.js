const RendezVous = require('../../models/RendezVous');
const Utilisateur = require('../../models/Utilisateur');
const Prestation = require("../../models/Prestation");

exports.getGeneralStats = async (req, res) => {
    try {
        // Compter les rendez-vous par statut
        const totalRendezVous = await RendezVous.countDocuments();
        const enAttente = await RendezVous.countDocuments({ statut: 'En attente' });
        const confirmes = await RendezVous.countDocuments({ statut: 'Confirmé' });
        const annules = await RendezVous.countDocuments({ statut: 'Annulé' });
        const termines = await RendezVous.countDocuments({ statut: 'Terminé' });

        // Compter le nombre total de clients
        const totalClients = await Utilisateur.countDocuments({ role: 'client' });

        // Compter le nombre total de prestations effectuées
        const totalPrestations = await Prestation.countDocuments();

        // Réponse JSON avec les statistiques
        res.json({
            totalRendezVous,
            rendezVousParStatut: { enAttente, confirmes, annules, termines },
            totalClients,
            totalPrestations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getTopPrestations = async (req, res) => {
    try {
        // Agrégation pour compter les prestations les plus demandées
        const topPrestations = await RendezVous.aggregate([
            { $unwind: "$prestations" }, // Décomposer le tableau des prestations
            {
                $group: {
                    _id: "$prestations.prestation_id",
                    totalDemandes: { $sum: 1 }
                }
            },
            { $sort: { totalDemandes: -1 } }, // Trier par nombre de demandes décroissant
            { $limit: 5 }, // Prendre les 5 prestations les plus demandées
            {
                $lookup: {
                    from: "prestations",
                    localField: "_id",
                    foreignField: "_id",
                    as: "prestationDetails"
                }
            },
            { $unwind: "$prestationDetails" }, // Décomposer l'objet prestation
            {
                $project: {
                    _id: 1,
                    nom: "$prestationDetails.nom",
                    totalDemandes: 1
                }
            }
        ]);

        res.json(topPrestations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

