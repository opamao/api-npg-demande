const connection = require("../config/db");

// Récupérer tous les utilisateurs
exports.getAllGadgets = (req, res) => {
  connection.query("SELECT * FROM demandes_gadgets", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des données" });
    }
    res.status(200).json(results);
  });
};

// Récupérer les demandes d'un tilisateur par son ID
exports.getGadgetById = (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM demandes_gadgets WHERE demande_par_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la récuppération des données." });
      }
      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Pas de demandes disponibles." });
      }
      res.status(200).json(result[0]);
    }
  );
};

// Faire une demande
exports.createGadget = async (req, res) => {
  const { qvd, par, pour, quantite, statut, dateDemande, dateValide } =
    req.body;

  try {
    // Insertion dans la base de données
    const query =
      "INSERT INTO demandes_gadgets (qvd_id, demande_par_id, demande_pour_id, quantite, statut, date_demande, date_valide VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [qvd, par, pour, quantite, statut, dateDemande, dateValide],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Impossible de faire une demande. Veuillez réessayer!!!",
            error: err,
          });
        }

        // Réponse de succès
        res.status(201).json({ message: "Votre demande a été envoyé." });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'envoie de la demande.",
      error: error,
    });
  }
};
