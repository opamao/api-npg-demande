const connection = require("../config/db");

// Récupérer tous les rôles
exports.getAllPermissions = (req, res) => {
  connection.query("SELECT * FROM permissions", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des permissions" });
    }
    res.status(200).json(results);
  });
};

// Vérification si pays existe
const checkIfUserPermissionExists = (libelle) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM permissions WHERE libelle_permission = ?`;
    connection.query(query, [libelle], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Créer un nouvel utilisateur
exports.createPermission = async (req, res) => {
  const { libelle } = req.body;

  try {
    const existingPermissionLibelle = await checkIfUserPermissionExists(libelle);
    if (existingPermissionLibelle.length > 0) {
      return res.status(400).json({
        message: "La permission existe déjà. Veuillez essayer un autre.",
      });
    }

    // Insertion dans la base de données
    const query = "INSERT INTO permissions (libelle_permission) VALUES (?)";
    connection.query(query, [libelle], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Impossible d'ajouter la permission. Veuillez réessayer!!!",
          error: err,
        });
      }

      // Réponse de succès
      res.status(201).json({ message: libelle + " a été ajouté." });
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la permission.",
      error: error,
    });
  }
};
