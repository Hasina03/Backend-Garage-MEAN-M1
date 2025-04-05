const RendezVous = require('../../models/RendezVous');


exports.getRendezVousMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.id;
        const rendezVous = await RendezVous.find({
            mecanicien_id: mecanicienId,
            statut: { $ne: "Terminé" }
        })
        .populate("client_id", "nom")
        .populate("vehicule_id", "nom")
        .select("date_rdv client_id vehicule_id");
        const result = rendezVous.map(rdv => ({
            id: rdv._id,
            client: rdv.client_id.nom,
            vehicule: rdv.vehicule_id.nom,
            date_rdv: rdv.date_rdv
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
