const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

const authenticateToken = require("../middleware/authMiddleware");

// Définition des routes pour les utilisateurs
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);

// Exemple de route protégée
router.get("/profile", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Accès au profil utilisateur", userId: req.user.userId });
});

module.exports = router;
