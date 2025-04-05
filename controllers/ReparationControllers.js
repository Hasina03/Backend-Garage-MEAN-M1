const Reparation = require('../models/Reparation');


const AddReparation = async (req, res) => {
    try {
        const { client_id, mecanicien_id, vehicule_id, devis_id, pieces_utilisees, date_debut, date_fin_estimee } = req.body;

        if (!client_id || !mecanicien_id || !vehicule_id || !devis_id || !pieces_utilisees || !date_debut || !date_fin_estimee) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const newReparation = new Reparation({
            client_id,
            mecanicien_id,
            vehicule_id,
            devis_id,
            pieces_utilisees,
            date_debut,
            date_fin_estimee
        });

        await newReparation.save();

        res.status(201).json({ message: "Réparation ajoutée avec succès", reparation: newReparation });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


const deleteReparationVehicules=async(req,res)=>{
    try {
        await Devis.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message:"Article suprimer"
        });

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const getReparationVehicules=async(req,res)=>{
    try{
        const article=await Devis.find();
        res.status(201).json(article);
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

module.exports = {AddReparation,deleteReparationVehicules,getReparationVehicules};

