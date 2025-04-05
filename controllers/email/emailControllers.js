
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendResetPasswordEmail = require('../../models/email');
const User = require('../../models/Utilisateur'); 

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

 
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_KEY, 
            { expiresIn: '1h' }      
        );

   
        const resetLink = `http://localhost:4200/reset-password?token=${token}`;

     
        await sendResetPasswordEmail(email, resetLink);

        res.status(200).json({ message: 'Lien de réinitialisation envoyé.', resetLink });
    } catch (error) {
        console.error("Erreur dans la fonction forgotPassword:", error); 
        res.status(500).send("Erreur du serveur: " + error.message);
    }
};


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY,);
        const user = await User.findOne({ _id: decoded.id, email: decoded.email });
        if (!user) {
            return res.status(400).send("Token invalide ou expiré.");
        }
        user.mdp = newPassword;
        await user.save();

        res.status(200).json({message:"Mot de passe réinitialisé."});
    } catch (error) {
        console.error("Erreur dans la fonction resetPassword:", error); // Ajoute un log d'erreur
        return res.status(400).send("Token invalide ou expiré. Détail de l'erreur: " + error.message);
    }
};
