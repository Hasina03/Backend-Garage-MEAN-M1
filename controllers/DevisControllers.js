const Devis = require('../models/Devis');

const addDevis = async (req, res) => {
    try {
        const { client_id, mecanicien_id, vehicule_id, pieces_estimees } = req.body;

        if (!client_id || !mecanicien_id || !vehicule_id || !pieces_estimees) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        const montant = pieces_estimees.reduce((total, piece) => {
            return total + (piece.quantite * piece.prix_unitaire);
        }, 0);
       
        const newDevis = new Devis({
            client_id,
            mecanicien_id,
            vehicule_id,
            pieces_estimees,
            montant
        });

        await newDevis.save();

        res.status(201).json({ message: "Devis créé avec succès", devis: newDevis });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


const deleteDevis=async(req,res)=>{
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

const getDevis=async(req,res)=>{
    try{
        const article=await Devis.find();
        res.status(201).json(article);
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

module.exports = {
    addDevis,
    deleteDevis,
    getDevis
};

