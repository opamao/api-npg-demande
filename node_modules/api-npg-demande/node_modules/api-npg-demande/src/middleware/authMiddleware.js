const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Récupérer le token dans l'en-tête 'Authorization'

  if (!token) {
    return res.status(403).json({ message: "Vous n'êtes pas autorisé a mener cette action. Connectez-vous ou créer votre compte." });
  }

  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Veuillez-vous reconnecter pour mener cette action." });
    }

    req.user = decoded;  // Décoder le token et attacher les informations de l'utilisateur à la requête
    next();  // Passer au prochain middleware ou à la route
  });
};

module.exports = authenticateToken;
