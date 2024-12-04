const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();


router.get('/',authController.protect,authController.getUsers)
router.post("/signup",authController.signUp);
router.post("/login", authController.logIn);

module.exports = router;

// header
// payload
// signature

// signature= header , payload , secretstring
