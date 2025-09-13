const express = require("express")
const friendsController = require("../controllers/friendsController")
const authController = require("../controllers/authController")

const router = express.Router()
router.route("/add").post(authController.protect, friendsController.addFriend)

module.exports = router
