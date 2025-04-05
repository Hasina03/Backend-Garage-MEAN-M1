const jwt = require('jsonwebtoken');
const jwtAuth = (role = null) => {
    return async (req, res, next) => {
        console.log(`🔍 jwtAuth appelé avec rôle : ${role} pour la route ${req.originalUrl}`);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Accès refusé ! Aucun token fourni" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = decoded; 
            
            console.log("🔍 Utilisateur authentifié :", req.user);

            if (role && req.user.role !== role) {
                return res.status(403).json({ message: `Accès interdit. Permission refusée. Rôle attendu: ${role} | Rôle reçu: ${req.user.role}` });
            }

            next();
        } catch (error) {
            return res.status(403).json({ message: "Token expiré ou invalide" });
        }
    };
};


module.exports = jwtAuth;
