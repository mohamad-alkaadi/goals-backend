const express = require("express")
const friendsController = require("../controllers/friendsController")
const authController = require("../controllers/authController")

const router = express.Router()
router.route("/").get(authController.protect, friendsController.getAllFriends)

router.route("/add").post(authController.protect, friendsController.addFriend)
router
  .route("/delete")
  .delete(authController.protect, friendsController.deleteFriend)

router
  .route("/requests")
  .get(authController.protect, friendsController.getAllFriendRequests)
  .post(authController.protect, friendsController.acceptFriendRequest)
  .delete(authController.protect, friendsController.rejectFriendRequest)

module.exports = router
