const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/sendmail",authController.sendOTP);
router.get("/action/:email",authController.setAction);
router.post("/forgotPassword", authController.forgotPassword);

// router.post("/resetPassword", jwtAuth, authController.resetPassword);

module.exports = router;