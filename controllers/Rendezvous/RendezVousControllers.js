const RendezVous = require('../../models/RendezVous');
const Piece = require('../../models/Piece'); // Ajuste le chemin en fonction de l'emplacement de ton fichier



const addRendezVous = async (req, res) => {
    try {
        const { client_id, mecanicien_id, vehicule_id, date_rdv, prestations } = req.body;

        if (!client_id || !vehicule_id || !date_rdv || !prestations) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

   
        for (const prestation of prestations) {
            if (!prestation.prestation_id) {
                return res.status(400).json({ message: "Chaque prestation doit avoir un prestation_id." });
            }
        }

        const newRendezVous = new RendezVous({
            client_id,
            mecanicien_id,
            vehicule_id,
            date_rdv,
            prestations
        });

        await newRendezVous.save();

        res.status(201).json({ message: "Rendez-vous créé avec succès", rendezVous: newRendezVous });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const deleteRendezVous = async (req, res) => {
    try {
        await RendezVous.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Rendez-vous supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
const ajouterMecanicienARendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const { mecanicienId } = req.body;

        if (!id) {
            console.log("Erreur : aucun ID de rendez-vous reçu.");
            return res.status(400).json({ error: "L'ID du rendez-vous est requis." });
        }

        // Vérifie si l'ID du mécanicien est bien transmis
        if (!mecanicienId) {
            console.log("Erreur : aucun ID de mécanicien reçu.");
            return res.status(400).json({ error: "L'ID du mécanicien est requis." });
        }

        // Vérifie si le rendez-vous existe dans la base de données
        const rendezVous = await RendezVous.findByIdAndUpdate(id, {  mecanicien_id:mecanicienId }, { new: true });

        if (!rendezVous) {
            console.log("Aucun rendez-vous trouvé avec cet ID :", id);
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        return res.status(200).json({ message: "Mécanicien ajouté avec succès", rendezVous });

    } catch (error) {
        console.error("Erreur lors de l'ajout du mécanicien :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

const updateStatutRdv = async (req, res) => {
    try {
        const { id } = req.params;
        
        const rdv = await RendezVous.findByIdAndUpdate(
            id,
            { statut: 'Confirmé' },
            { new: true }
        );
        
        if (!rdv) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }
        
        res.status(200).json(rdv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




const getRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.find().populate('client_id', 'nom prenom email').populate('vehicule_id', 'marque modele annee immatriculation kilometrage ').populate('mecanicien_id', 'nom prenom').populate('prestations.prestation_id', 'nom').populate('prestations.prestation_id', 'nom').populate({
            path: 'vehicule_id',
            populate: { path: 'type', select: 'nom' }
        });
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const getRendezVousByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;

        if (!clientId) {
            return res.status(400).json({ message: "L'ID du client est requis." });
        }

        const rendezVous = await RendezVous.find({ client_id: clientId })
            .populate('client_id', 'nom prenom email')
            .populate('vehicule_id', 'marque modele annee immatriculation kilometrage')
            .populate('mecanicien_id', 'nom prenom')
            .populate('prestations.prestation_id', 'nom');

        if (!rendezVous || rendezVous.length === 0) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce client." });
        }

        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const updateDateRdv = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate } = req.body; 

        if (!newDate) {
            return res.status(400).json({ error: "La nouvelle date est requise" });
        }

        const rdv = await RendezVous.findByIdAndUpdate(
            id,
            { date_rdv: newDate },
            { new: true } 
        );

        if (!rdv) {
            return res.status(404).json({ error: "Rendez-vous non trouvé" });
        }

        res.status(200).json({ message: "Date mise à jour avec succès", rendezVous: rdv });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getMecanicienForRendezVous = async (req, res) => {
    try {
       
        const rendezVous = await RendezVous.find().populate('mecanicien_id', 'nom email');

     
        if (!rendezVous) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé" });
        }

      
        res.status(200).json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};



const updateRendezVous = async (req, res) => {
    try {
        const { statut } = req.body;
        const rendezVous = await RendezVous.findByIdAndUpdate(req.params.id, { statut }, { new: true });

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        res.status(200).json({ message: "Statut mis à jour", rendezVous });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}
const genererfacture = async (req, res) => {
    try {
        const { rendezVousId } = req.body; 
        const rendezVous = await RendezVous.findById(rendezVousId)
            .populate('prestations.prestation_id')
            .populate('vehicule_id.type')
            .exec();

        if (!rendezVous) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
        }

       
        let totalFacture = 0;

        for (let prestation of rendezVous.prestations) {
            const prestationDetails = prestation.prestation_id;
            if (prestationDetails) {
                totalFacture += prestationDetails.prix_main_oeuvre;
            }
        }

     
        const vehicule = rendezVous.vehicule_id;
        const typeVehicule = vehicule.type; 


        let piecesFacture = [];
        if (vehicule) {
            for (let prestation of rendezVous.prestations) {
                const prestationDetails = prestation.prestation_id;
                if (prestationDetails && prestationDetails.processus) {
                    for (let processus of prestationDetails.processus) {
                        for (let piece of processus.pieces_possibles) {
                           
                            console.log('Vérification de la pièce:', piece);
                            const pieceDisponible = await Piece.findById(piece._id);
                            if (!pieceDisponible) {
                                console.log('Pièce non trouvée:', piece._id);
                                continue; 
                            }

                            const pieceVariante = pieceDisponible.variantes.find(variante => String(variante.type_vehicule) === String(typeVehicule._id));
                            if (pieceVariante) {
                                piecesFacture.push({
                                    nom: pieceDisponible.nom,
                                    prix: pieceVariante.prix
                                });
                                totalFacture += pieceVariante.prix; 
                            } else {
                                console.log('Aucune variante trouvée pour la pièce:', pieceDisponible.nom);
                            }
                        }
                    }
                }
            }
        }

        // Retourner la facture
        res.status(200).json({
            prestation: rendezVous.prestations,
            vehicule: vehicule,
            pieces: piecesFacture,
            total: totalFacture
        });
    } catch (error) {
        console.error('Erreur lors de la génération de la facture:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};



module.exports = {
    addRendezVous,
    deleteRendezVous,
    getRendezVous,
    updateRendezVous,
    getMecanicienForRendezVous,
    ajouterMecanicienARendezVous,
    updateStatutRdv,
    updateDateRdv,
    getRendezVousByClientId,
    genererfacture
};
