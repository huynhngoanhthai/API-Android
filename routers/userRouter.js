const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/sendmail",authController.sendOTP);
router.get("/action/:email",authController.setAction);

// router.post("/resetPassword", jwtAuth, authController.resetPassword);
// router.post("/forgotPassword", authController.forgotPassword);

module.exports = router;