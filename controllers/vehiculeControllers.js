
const Vehicle = require('../models/Vehicules');  

const addVehicule = async (req, res) => {
    try {
        const { marque, modele, annee, type_moteur } = req.body; 
        const newVehicle = new Vehicle({
            marque,
            modele,
            annee,
            type_moteur 
        });
        const savedVehicle = await newVehicle.save();

        res.status(201).json({
            message: 'Véhicule ajouté avec succès',
            vehicle: savedVehicle
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule', error: err });
    }
};


const deleteVehicule=async(req,res)=>{
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message:"Article suprimer"
        });

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const getVehicule=async(req,res)=>{
    try{
        const article=await Vehicle.find();
        res.status(201).json(article);
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}


module.exports={addVehicule,deleteVehicule,getVehicule};