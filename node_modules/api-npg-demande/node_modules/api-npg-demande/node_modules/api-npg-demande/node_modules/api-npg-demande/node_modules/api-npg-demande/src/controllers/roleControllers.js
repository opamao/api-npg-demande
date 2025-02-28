const connection = require("../config/db");

// Récupérer tous les rôles
exports.getAllRoles = (req, res) => {
  connection.query("SELECT * FROM roles", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des rôles" });
    }
    res.status(200).json(results);
  });
};

// Vérification si role existe
const checkIfUserRoleExists = (libelle) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM roles WHERE libelle_role = ?`;
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
exports.createRole = async (req, res) => {
  const { libelle } = req.body;

  try {
    const existingRoleLibelle = await checkIfUserRoleExists(libelle);
    if (existingRoleLibelle.length > 0) {
      return res.status(400).json({
        message: "Le rôle existe déjà. Veuillez essayer un autre.",
      });
    }

    // Insertion dans la base de données
    const query = "INSERT INTO roles (libelle_role) VALUES (?)";
    connection.query(query, [libelle], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Impossible d'ajouter le rôle. Veuillez réessayer!!!",
          error: err,
        });
      }

      // Réponse de succès
      res.status(201).json({ message: libelle + " a été ajouté." });
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du rôle.",
      error: error,
    });
  }
};
