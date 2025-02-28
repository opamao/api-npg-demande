const express = require("express");
const router = express.Router();
const permissionControllers = require("../controllers/permissionControllers");
const authenticateToken = require("../middleware/authMiddleware");


router.get("/", permissionControllers.getAllPermissions);
router.post("/", authenticateToken, permissionControllers.createPermission);


module.exports = router;