const inscription=require('../models/Utilisateur');


const createClient =async(req,res)=>{
    try {
        const client =new inscription(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({error:error.message});
    
    }
};


const getClient=async(req,res)=>{
  try {
    const client=await inscription.find().select('-mdp');
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({error:error.message});
  }
};

const getMecaniciens = async (req, res) => {
  try {
    const mecaniciens = await inscription.find({ role: "mecanicien" }).select('-mdp');
    res.status(200).json(mecaniciens);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!["client", "mecanicien", "manager"].includes(role)) {
          return res.status(400).json({ error: "Rôle invalide" });
      }

      const user = await inscription.findByIdAndUpdate(id, { role }, { new: true });
      if (!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await inscription.findByIdAndDelete(id);
      console.log("ID de l'utilisateur passé :", id);
      
      if (!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

module.exports={createClient,getClient,updateRole,deleteClient,getMecaniciens};