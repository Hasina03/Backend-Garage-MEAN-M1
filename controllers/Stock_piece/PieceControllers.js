const Piece = require('../../models/Piece');

const addPiece = async (req, res) => {
    try {
        const { nom, variantes } = req.body;

        if (!nom || !Array.isArray(variantes) || variantes.length === 0) {
            return res.status(400).json({ message: "Tous les champs sont requis et 'variantes' doit être un tableau non vide" });
        }

        for (const variante of variantes) {
            if (!variante.prix || !variante.type_vehicule) {
                return res.status(400).json({ message: "Chaque variante doit contenir un prix et un type de véhicule" });
            }
        }

        const newPiece = new Piece({
            nom,
            variantes
        });

        await newPiece.save();
        res.status(201).json({ message: "Pièce ajoutée avec succès", piece: newPiece });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const getPieces = async (req, res) => {
    try {
        const pieces = await Piece.find().populate('variantes.type_vehicule', 'marque modele annee type_moteur');
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
