const express = require("express");
const { getUsers } = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware("admin"), getUsers);
module.exports = router;