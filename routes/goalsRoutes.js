const express = require("express")
const goalsController = require("../controllers/goalsController")

const authController = require("../controllers/authController")
const router = express.Router()

router
  .route("/")
  .post(authController.protect, goalsController.createNewGoal)
  .get(authController.protect, goalsController.getAllGoals)

router
  .route("/:id")
  .patch(authController.protect, goalsController.updateGoal)
  .get(authController.protect, goalsController.getGoal)
module.exports = router
