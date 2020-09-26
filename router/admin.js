const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controller/admin");
const router = express.Router();

router.post("/admins", adminController.create);
router.post("/admins/login", adminController.login);
router.post("/admins/logout", adminAuth, adminController.logout);
router.post("/admins/logoutAll", adminAuth, adminController.logoutAll);

router.get("/admins/me", adminAuth, adminController.profile);

router.patch("/admins/me", adminAuth, adminController.update);

router.delete("/admins/me", adminAuth, adminController.delete);

module.exports = router;
