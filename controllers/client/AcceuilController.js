const Prestation = require("../../models/Prestation")
const Piece = require("../../models/Piece")


exports.getAccueilPrestations = async (req, res) => {
  try {
    const prestations = await Prestation.find()
      .populate("processus.pieces_possibles");

    const formattedPrestations = prestations.map((prestation) => {
      const supplementMin =
        prestation.supplementMainOeuvre.length > 0
          ? Math.min(...prestation.supplementMainOeuvre.map(s => s.supplement))
          : 0;

      const prixMinTotal =
        prestation.prix_main_oeuvre + supplementMin;

      return {
        id: prestation._id,
        nom: prestation.nom,
        description: prestation.description,
        prix_minimum: prixMinTotal,
      };
    });

    res.status(200).json(formattedPrestations);
  } catch (error) {
    console.error("Erreur getAccueilPrestations:", error);
    res.status(500).json({ message: error.message });
  }
};

