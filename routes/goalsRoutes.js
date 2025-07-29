const express = require("express")
const goalsController = require("../controllers/goalsController")

const authController = require("../controllers/authController")
const router = express.Router()

router.post("/", authController.protect, goalsController.createNewGoal)

module.exports = router
