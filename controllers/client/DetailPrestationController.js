const Prestation = require('../../models/Prestation');
const TypeVehicule = require('../../models/TypeVehicule');
const Piece = require('../../models/Piece');

exports.getPrestationById = async (req, res) => {
    try {
        const prestation = await Prestation.findById(req.params.id)
            .populate({
                path: "processus.pieces_possibles",
                populate: {
                    path: "compatibilites.vehicule",
                    populate: {
                        path: "type_vehicule",
                        model: "TypeVehicule"
                    }
                }
            })
            .populate("supplementMainOeuvre.typeVehicule");

        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }

        // Map pour stocker les données par TypeVehicule
        const typeVehiculeMap = new Map();

        // Parcourir tous les processus et leurs pièces
        prestation.processus.forEach(processus => {
            processus.pieces_possibles.forEach(piece => {
                piece.compatibilites.forEach(compatibilite => {
                    if (compatibilite.vehicule && compatibilite.vehicule.type_vehicule) {
                        const typeVehicule = compatibilite.vehicule.type_vehicule;
                        const typeId = typeVehicule._id.toString();
                        const typeNom = typeVehicule.nom;

                        if (!typeVehiculeMap.has(typeId)) {
                            typeVehiculeMap.set(typeId, {
                                nom: typeNom,
                                prixParEtape: new Map(),
                                typeVehiculeId: typeVehicule._id
                            });
                        }

                        const typeData = typeVehiculeMap.get(typeId);
                        const etapeKey = `${processus.ordre}-${processus.nom_etape}`;

                        // Garder le prix minimal pour cette étape et ce type
                        if (!typeData.prixParEtape.has(etapeKey) ||
                            compatibilite.prix < typeData.prixParEtape.get(etapeKey)) {
                            typeData.prixParEtape.set(etapeKey, compatibilite.prix);
                        }
                    }
                });
            });
        });

        // Ajouter les types de véhicules qui ont des suppléments mais pas de pièces
        prestation.supplementMainOeuvre?.forEach(suppl => {
            if (suppl.typeVehicule) {
                const typeId = suppl.typeVehicule._id.toString();
                if (!typeVehiculeMap.has(typeId)) {
                    typeVehiculeMap.set(typeId, {
                        nom: suppl.typeVehicule.nom,
                        prixParEtape: new Map(),
                        typeVehiculeId: suppl.typeVehicule._id
                    });
                }
            }
        });

        // Construire le tableau final prix_par_vehicule
        const prixParVehicule = Array.from(typeVehiculeMap.values()).map(typeData => {
            // Construire prixPieces pour toutes les étapes
            const prixPieces = prestation.processus
                .sort((a, b) => a.ordre - b.ordre)
                .map(processus => {
                    const etapeKey = `${processus.ordre}-${processus.nom_etape}`;
                    const prix = typeData.prixParEtape.get(etapeKey) || null;
                    return {
                        ordre: processus.ordre,
                        nom_etape: processus.nom_etape,
                        prix: prix
                    };
                });

            // Chercher le supplément pour ce type de véhicule
            const supplementEntry = prestation.supplementMainOeuvre?.find(
                suppl => suppl.typeVehicule && suppl.typeVehicule._id.equals(typeData.typeVehiculeId)
            );
            const supplement = supplementEntry ? supplementEntry.supplement : null;

            // Calculer le prix total
            const sommePieces = prixPieces.reduce((sum, piece) => {
                return sum + (piece.prix || 0);
            }, 0);
            const prixTotal = prestation.prix_main_oeuvre + sommePieces + (supplement || 0);

            return {
                vehicule: typeData.nom,
                prixPieces: prixPieces,
                supplement: supplement,
                prixTotal: prixTotal
            };
        });

        const formattedPrestation = {
            id: prestation._id.toString(),
            nom: prestation.nom,
            description: prestation.description,
            prix_main_oeuvre: prestation.prix_main_oeuvre,
            prix_par_vehicule: prixParVehicule
        };

        res.status(200).json(formattedPrestation);
    } catch (error) {
        console.error("Erreur lors de la récupération de la prestation:", error);
        res.status(500).json({ message: error.message });
    }
};


