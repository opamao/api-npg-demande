const connection = require("../config/db");

// Récupérer tous les utilisateurs
exports.getAllPays = (req, res) => {
  connection.query("SELECT * FROM pays", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de la base de données" });
    }
    res.status(200).json(results);
  });
};

// Vérification si pays existe
const checkIfUserPaysExists = (libelle) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM pays WHERE libelle_pays = ?`;
    connection.query(query, [libelle], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Créer un nouveau pays
exports.createPays = async (req, res) => {
  const { libelle } = req.body;

  try {
    const existingPaysLibelle = await checkIfUserPaysExists(libelle);
    if (existingPaysLibelle.length > 0) {
      return res.status(400).json({
        message: "Le pays existe déjà. Veuillez essayer un autre.",
      });
    }

    // Insertion dans la base de données
    const query = "INSERT INTO pays (libelle_pays) VALUES (?)";
    connection.query(query, [libelle], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Impossible d'ajouter le pays. Veuillez réessayer!!!",
          error: err,
        });
      }

      // Réponse de succès
      res.status(201).json({ message: libelle + " a été ajouté." });
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du pays.",
      error: error,
    });
  }
};
