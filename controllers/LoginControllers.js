
const client=require('../models/Utilisateur');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const login= async(req,res)=>{
    try{
        const {email,mdp}=req.body;
        const user= await  client.findOne({email});
      
        if(!user){
          return  res.status(400).json({ message: "Identifiants incorrects"});
        }
    
        const motdepass= await bcrypt.compare(mdp,user.mdp);
        if (!motdepass) {
            return res.status(400).json({ message: "Identifiants incorrects" });
        }

        const token=jwt.sign({
         id:user._id,
         email:user.email,
         role:user.role
        },
         
         process.env.JWT_KEY,
         {expiresIn:"1h"}
        );
        res.status(200).json({ message: "Connexion réussie" ,token:token});
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports=login;