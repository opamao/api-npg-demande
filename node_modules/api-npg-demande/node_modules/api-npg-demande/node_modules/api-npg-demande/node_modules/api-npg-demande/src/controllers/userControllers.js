const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const connection = require("../config/db");

// Fonction pour générer le token JWT
const generateToken = (userId) => {
  const payload = { userId: userId }; // Crée le payload avec l'ID de l'utilisateur
  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '1h' });
};

// Fonction pour hacher le mot de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Créer un "sel"
  const hashedPassword = await bcrypt.hash(password, salt); // Hachage du mot de passe
  return hashedPassword;
};

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur de la base de données" });
    }
    res.status(200).json(results);
  });
};

// Récupérer un utilisateur par ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récuppération des données." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(result[0]);
  });
};

const checkIfUserEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ? `;
    connection.query(query, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const checkIfUserPhoneExists = (phone) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE phone = ?`;
    connection.query(query, [phone], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const checkIfUserUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    connection.query(query, [username], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    image,
    username,
    website,
    currency,
    type,
    status,
    code,
    password,
  } = req.body;

  try {
    const existingUserEmail = await checkIfUserEmailExists(email);
    if (existingUserEmail.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "L'adresse email est déjà utilisé. Veuillez essayer un autre.",
        });
    }

    const existingUserPhone = await checkIfUserPhoneExists(phone);
    if (existingUserPhone.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Le numérot de téléphone est déjà utilisé. Veuillez essayer un autre.",
        });
    }

    const existingUserUsername = await checkIfUserUsernameExists(username);
    if (existingUserUsername.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Votre username est déjà utilisé. Veuillez essayer un autre.",
        });
    }

    // Générer un UUID pour l'utilisateur
    // const userId = uuidv4();

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Insertion dans la base de données
    const query =
      "INSERT INTO users (name, email, phone, image, username, website, currency, type, status, code, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [
        name,
        email,
        phone,
        image,
        username,
        website,
        currency,
        type,
        status,
        code,
        hashedPassword,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Impossible de créer votre compte. Veuillez réessayer!!!",
            error: err,
          });
        }

        // Réponse de succès
        res.status(201).json({ message: "Utilisateur créé" });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error,
    });
  }
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword); // Comparaison du mot de passe
};

// Exemple d'utilisation dans un contrôleur de connexion
exports.loginUser = async (req, res) => {
  const { login, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  connection.query(query, [login, login], async (err, result) => {
    if (err || result.length === 0) {
      return res
        .status(400)
        .json({ message: "Votre adresse email ou username est incorrect" });
    }

    const user = result[0];
    const isMatch = await comparePassword(password, user.password); // Vérification du mot de passe

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Votre mot de passe est incorrect" });
    }

    if (user.status === "Inactive") {
      return res.status(400).json({
        message: "Votre compte est désactivé. Veuillez contacter l'admin.",
      });
    }

    // Générer le token pour l'utilisateur connecté
    const token = generateToken(user.id);
    res.status(200).json({
      message: "Connexion réussie",
      // Ajoute ici les informations de l'utilisateur
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        username: user.username,
        website: user.website,
        currency: user.currency,
        type: user.type,
        code: user.code,
      },
      // Envoie le token au client
      token: token, 
    });
  });
};
