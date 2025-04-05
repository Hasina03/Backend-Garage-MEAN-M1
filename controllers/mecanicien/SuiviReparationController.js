const RendezVous = require("../../models/RendezVous");
const Prestation = require("../../models/Prestation");

exports.getDetailsRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const rendezVous = await RendezVous.findById(id)
            .populate("client_id", "nom")
            .populate("vehicule_id", "nom")
            .populate("prestations.prestation_id", "nom description") // Peupler les prestations
            .select("date_rdv client_id vehicule_id prestations");

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        const prestations = rendezVous.prestations.map(p => {
            const statuts = p.statuts;
            const dernierStatut = Object.keys(statuts)
                .filter(key => statuts[key]) 
                .sort((a, b) => new Date(statuts[b]) - new Date(statuts[a]))[0]; 

            return {
                id: p.prestation_id._id,
                nom: p.prestation_id.nom,
                description: p.prestation_id.description,
                statut: dernierStatut || "En attente" 
            };
        });

        res.status(200).json({
            id: rendezVous._id,
            client: rendezVous.client_id.nom,
            vehicule: rendezVous.vehicule_id.nom,
            date_rdv: rendezVous.date_rdv,
            prestations
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le statut d'une prestation
// exports.updateStatutPrestation = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { statut } = req.body;

//         const prestation = await Prestation.findByIdAndUpdate(id, { statut }, { new: true });

//         if (!prestation) {
//             return res.status(404).json({ message: "Prestation non trouvée" });
//         }

//         res.status(200).json({ message: "Statut mis à jour", prestation });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.updateStatutPrestation = async (req, res) => {
    try {
        const { rendezvousId, prestationId, statut } = req.body;
        const rendezVous = await RendezVous.findById(rendezvousId);
        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        const prestation = rendezVous.prestations.find(p => p.prestation_id.toString() === prestationId);
        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée dans ce rendez-vous" });
        }

        prestation.statuts[statut] = new Date();

 
        await rendezVous.save();

        const allPrestationsDone = rendezVous.prestations.every(p =>
            p.statuts.Terminé || p.statuts.Annulé
        );

        if (allPrestationsDone) {
            rendezVous.statut = "Terminé";
            await rendezVous.save();
        }

        res.status(200).json({ message: "Statut mis à jour avec succès", rendezVous });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

