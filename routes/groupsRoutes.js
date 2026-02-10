const express = require("express")
const groupsController = require("../controllers/groupsController")
const authController = require("../controllers/authController")
const router = express.Router()

router
  .route("/")
  .get(authController.protect, groupsController.getAllGroups)
  .post(authController.protect, groupsController.createNewGroup)

module.exports = router
