const RendezVous = require('../../models/RendezVous');


exports.ajouterAvis = async (req, res) => {
    try {
        const { note, commentaire } = req.body;
        const rendezVous = await RendezVous.findById(req.params.id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        rendezVous.avis_client = { note, commentaire };
        await rendezVous.save();

        res.status(200).json({ message: "Avis ajouté avec succès", avis: rendezVous.avis_client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.modifierAvis = async (req, res) => {
    try {
        const { note, commentaire } = req.body;
        const rendezVous = await RendezVous.findById(req.params.id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        if (!rendezVous.avis_client) {
            return res.status(400).json({ message: "Aucun avis trouvé pour ce rendez-vous" });
        }

        if (note !== undefined) rendezVous.avis_client.note = note;
        if (commentaire !== undefined) rendezVous.avis_client.commentaire = commentaire;

        await rendezVous.save();

        res.status(200).json({ message: "Avis modifié avec succès", avis: rendezVous.avis_client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.supprimerAvis = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findById(req.params.id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        rendezVous.avis_client = undefined;
        await rendezVous.save();

        res.status(200).json({ message: "Avis supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
