const express = require("express")
const friendsController = require("../controllers/friendsController")
const authController = require("../controllers/authController")

const router = express.Router()
router.route("/add").post(authController.protect, friendsController.addFriend)
router
  .route("/requests")
  .get(authController.protect, friendsController.getAllFriendRequests)

module.exports = router
