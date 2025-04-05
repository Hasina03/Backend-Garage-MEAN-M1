const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const inscription=mongoose.Schema({
    nom :{
        type : String,
        required : [true,"Nom requis"]
    },
    prenom : {
        type : String,
        required : [true,"Prenom requis"]
    },
    email : {
        type:String,
        required :[true ,"Email requis"],
        unique:true
    },
    telephone: {
        type: String,
        required: [true,"telephone requis"],
        unique: true
    },

    mdp :{type:String,required :[true,"Mot de passe requis"]},
    adresse: {
        type: String,
        required:[true,"adresse requis"]
    },
    date_inscription: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["client", "mecanicien", "manager"],
        default: "client"
    }
});


inscription.pre('save',async function(next){
    if(!this.isModified('mdp')) return next();
    try{
      const salt= await bcrypt.genSalt(10);
      this.mdp=await bcrypt.hash(this.mdp,salt);
      next();
    }catch(err){
      next(err);
  
    }
  });
  
  module.exports=mongoose.model('Utilisateur',inscription);