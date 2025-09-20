const User = require("../models/userModel")
const FriendRequest = require("../models/friendRequestsModel")
const catchAsync = require("../utils/catchAsync")
const friendsUtils = require("../utils/friendsUtils")
const resUtils = require("../utils/resUtils")

exports.getAllFriends = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("friends", "name")
    .lean()

  resUtils.sendResponseWithData(res, 200, "success", user.friends)
})

exports.addFriend = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  const toUserId = await friendsUtils.findUserByEmail(res, req.body.email)
  await friendsUtils.checkIfFriendshipExists(res, req.body.userId, toUserId)
  await friendsUtils.checkForExistingRequest(res, req.body.userId, toUserId)

  await FriendRequest.create({
    from: req.body.userId,
    to: toUserId._id.toString(),
  })

  resUtils.sendResponseWithoutData(
    res,
    200,
    "success",
    "friend request sent successfully"
  )
})

exports.getAllFriendRequests = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  const friendRequests = await FriendRequest.find({ to: req.body.userId })
    .populate("from", "name")
    .lean()

  resUtils.sendResponseWithData(res, 200, "success", friendRequests)
})

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await FriendRequest.findOneAndUpdate(
    {
      from: req.body.from,
      to: req.body.userId,
    },
    { status: "accepted" }
  )
  await friendsUtils.addFriendBothWays(req.body.userId, req.body.from)

  resUtils.sendResponseWithoutData(res, 200, "success", "Friend accepted")
})

exports.rejectFriendRequest = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await FriendRequest.findOneAndDelete({
    from: req.body.from,
    to: req.body.userId,
  })

  resUtils.sendResponseWithoutData(res, 200, "success", "Friend rejected")
})

exports.deleteFriend = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await friendsUtils.deleteFriendBothWays(req.body.userId, req.body.friendId)

  resUtils.sendResponseWithoutData(res, 200, "success", "Friend deleted")
})
