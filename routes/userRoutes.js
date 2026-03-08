const express = require("express")
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")

const router = express.Router()

router.post("/signup", authController.signup)
router.post("/signin", authController.signin)
router.get("/details", authController.protect, userController.getUserDetails)

module.exports = router
