const Piece = require('../../models/Piece');

const addPiece = async (req, res) => {
    try {
        const { nom,compatibilites} = req.body;

        if (!nom || !Array.isArray(compatibilites) || compatibilites.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis et 'variantes' doit être un tableau non vide" });
        }

        for (const variante of compatibilites) {
            if (!variante.vehicule || !variante.prix) {
                return res.status(400).json({ message: "Chaque variante doit contenir un prix et un type de véhicule" });
            }
        }

        const newPiece = new Piece({
            nom,
            compatibilites
        });

        await newPiece.save();
        res.status(201).json({ message: "Pièce ajoutée avec succès", piece: newPiece });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const getPieces = async (req, res) => {
    try {
        const pieces = await Piece.find().populate('compatibilites.vehicule', 'marque modele annee type_moteur')

        res.status(200).json(pieces);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const deletePiece = async (req, res) => {
    try {
        const piece = await Piece.findByIdAndDelete(req.params.id);

        if (!piece) {
            return res.status(404).json({ message: "Pièce non trouvée" });
        }

        res.status(200).json({ message: "Pièce supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    addPiece,
    getPieces,
    deletePiece
};
