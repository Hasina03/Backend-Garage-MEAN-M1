const Prestation = require('../../models/Prestation');
const TypeVehicule = require('../../models/TypeVehicule');
const Piece = require('../../models/Piece');

exports.getPrestationById = async (req, res) => {
    try {
        const prestation = await Prestation.findById(req.params.id)
            .populate({
                path: "processus.pieces_possibles",
                populate: {
                    path: "variantes.type_vehicule",
                    model: "TypeVehicule"
                }
            });

        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }

        let prixVehiculeMap = {};

        prestation.processus.forEach(processus => {
            processus.pieces_possibles.forEach(piece => {
                piece.variantes.forEach(variant => {
                    if (variant.type_vehicule && variant.type_vehicule.nom) {
                        const vehiculeId = variant.type_vehicule._id.toString();
                        if (!prixVehiculeMap[vehiculeId]) {
                            prixVehiculeMap[vehiculeId] = {
                                vehicule: variant.type_vehicule.nom,
                                prixPieces: {},
                                prixTotal: prestation.prix_main_oeuvre
                            };
                        }

                        prixVehiculeMap[vehiculeId].prixPieces[processus.nom_etape] = variant.prix;
                        prixVehiculeMap[vehiculeId].prixTotal += variant.prix;
                    }
                });
            });
        });

        Object.values(prixVehiculeMap).forEach(vehiculeData => {
            prestation.processus.forEach(processus => {
                if (!vehiculeData.prixPieces[processus.nom_etape]) {
                    vehiculeData.prixPieces[processus.nom_etape] = "Pièce indisponible";
                }
            });
        });

        const formattedPrestation = {
            id: prestation._id,
            nom: prestation.nom,
            description: prestation.description,
            prix_main_oeuvre: prestation.prix_main_oeuvre,
            prix_par_vehicule: Object.values(prixVehiculeMap)
        };

        res.status(200).json(formattedPrestation);
    } catch (error) {
        console.error("Erreur lors de la récupération de la prestation:", error);
        res.status(500).json({ message: error.message });
    }
};
