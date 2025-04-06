const Prestation = require('../../models/Prestation');
const Piece = require('../../models/Piece');
const TypeVehicule = require('../../models/TypeVehicule');
const Vehicule = require('../../models/Vehicules');

exports.getOptions = async (req, res) => {
    try {
        const vehicules = await Vehicule.find().populate('type_vehicule');
        const prestations = await Prestation.find().populate('processus.pieces_possibles');
        res.json({ vehicules, prestations });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error });
    }
};


exports.generateDevis = async (req, res) => {
    try {
      const { vehiculeId, prestationIds } = req.body;

      const vehicule = await Vehicule.findById(vehiculeId).populate('type_vehicule');
      if (!vehicule) return res.status(404).json({ message: 'Véhicule non trouvé' });

      const prestations = await Prestation.find({ _id: { $in: prestationIds } }).populate('processus.pieces_possibles');
      let totalDevis = 0;
      const devisDetails = [];

      for (const prestation of prestations) {
        let prixMainOeuvre = prestation.prix_main_oeuvre;

        // Appliquer un supplément s’il existe pour ce type de véhicule
        const supplement = prestation.supplementMainOeuvre.find(s => s.typeVehicule.equals(vehicule.type_vehicule._id));
        if (supplement) prixMainOeuvre += supplement.supplement;

        // Récupérer les pièces compatibles avec ce véhicule
        const piecesUtilisees = [];

        for (const processus of prestation.processus) {
          for (const pieceId of processus.pieces_possibles) {
            const piece = await Piece.findById(pieceId);
            const compat = piece.compatibilites.find(c => c.vehicule.equals(vehiculeId));
            if (compat) {
              piecesUtilisees.push({
                nom: piece.nom,
                prix: compat.prix,
              });
            }
          }
        }

        const totalPieces = piecesUtilisees.reduce((sum, p) => sum + p.prix, 0);
        const total = prixMainOeuvre + totalPieces;

        devisDetails.push({
          prestation: prestation.nom,
          main_oeuvre: prixMainOeuvre,
          pieces: piecesUtilisees,
          total
        });

        totalDevis += total;
      }

      res.status(200).json({
        vehicule: `${vehicule.marque} ${vehicule.modele} (${vehicule.annee})`,
        type_vehicule: vehicule.type_vehicule.nom,
        devis: devisDetails,
        totalGlobal: totalDevis
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la génération du devis.', error: err });
    }
  };
