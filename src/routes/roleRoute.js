const express = require("express");
const router = express.Router();
const roleControllers = require("../controllers/roleControllers");
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", authenticateToken, roleControllers.getAllRoles);
router.post("/", authenticateToken, roleControllers.createRole);


module.exports = router;