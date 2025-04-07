const Piece = require('../../models/Piece');
const Vehicule = require('../../models/Vehicules');

exports.getAllPiecesWithStock = async (req, res) => {
  try {
    const pieces = await Piece.find();

    const piecesWithTotalStock = pieces.map(piece => {
      const totalStock = piece.compatibilites.reduce((sum, c) => sum + c.quantite_stock, 0);
      return {
        _id: piece._id,
        nom: piece.nom,
        totalStock
      };
    });

    res.json(piecesWithTotalStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPieceCompatibilites = async (req, res) => {
  try {
    const piece = await Piece.findById(req.params.id).populate('compatibilites.vehicule');
    if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });

    res.json(piece.compatibilites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCompatibilite = async (req, res) => {
    const { pieceId, vehiculeId, prix, seuil_alerte } = req.body;

    try {
      const piece = await Piece.findById(pieceId);
      if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });

      const compatibilite = piece.compatibilites.find(c => c.vehicule.toString() === vehiculeId);
      if (!compatibilite) return res.status(404).json({ message: 'Compatibilité non trouvée' });

      compatibilite.prix = prix;
      compatibilite.seuil_alerte = seuil_alerte;

      await piece.save();
      res.json({ message: 'Compatibilité mise à jour', compatibilite });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.addStockToCompatibilite = async (req, res) => {
    const { pieceId, vehiculeId, ajout } = req.body;

    try {
      const piece = await Piece.findById(pieceId);
      if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });

      const compatibilite = piece.compatibilites.find(c => c.vehicule.toString() === vehiculeId);
      if (!compatibilite) return res.status(404).json({ message: 'Compatibilité non trouvée' });

      compatibilite.quantite_stock += ajout;

      await piece.save();
      res.json({ message: 'Stock mis à jour', compatibilite });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.addCompatibilite = async (req, res) => {
  const { pieceId, vehiculeId, prix, quantite_stock, seuil_alerte } = req.body;

  try {
    const piece = await Piece.findById(pieceId);
    if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });

    piece.compatibilites.push({
      vehicule: vehiculeId,
      prix,
      quantite_stock,
      seuil_alerte
    });

    await piece.save();
    res.json({ message: 'Compatibilité ajoutée', piece });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCompatibilite = async (req, res) => {
    const { pieceId, vehiculeId } = req.params;

    try {
      const piece = await Piece.findById(pieceId);
      if (!piece) return res.status(404).json({ message: 'Pièce non trouvée' });

      const index = piece.compatibilites.findIndex(c => c.vehicule.toString() === vehiculeId);
      if (index === -1) return res.status(404).json({ message: 'Compatibilité non trouvée' });

      piece.compatibilites.splice(index, 1);
      await piece.save();

      res.json({ message: 'Compatibilité supprimée' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.getVehicules = async (req, res) => {
    try {
        const vehicules = await Vehicule.find().populate('type_vehicule');
        res.json(vehicules);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  };


