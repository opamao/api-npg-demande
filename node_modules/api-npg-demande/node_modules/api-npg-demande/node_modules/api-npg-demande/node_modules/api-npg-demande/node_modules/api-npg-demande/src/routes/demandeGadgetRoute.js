const express = require("express");
const router = express.Router();
const demandeGadgetControllers = require("../controllers/demandeGadgetControllers");
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", authenticateToken, demandeGadgetControllers.getAllGadgets);
router.get("/:id", authenticateToken, demandeGadgetControllers.getGadgetById);
router.post("/", authenticateToken, demandeGadgetControllers.createGadget);


module.exports = router;