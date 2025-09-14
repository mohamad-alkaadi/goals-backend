const User = require("../models/userModel")
const FriendRequest = require("../models/friendRequestsModel")
const catchAsync = require("../utils/catchAsync")
const friendsUtils = require("../utils/friendsUtils")

exports.getAllFriends = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("friends", "name")
    .lean()

  res.status(200).json({
    status: "success",
    data: user.friends,
  })
})

exports.addFriend = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  const toUserId = await friendsUtils.findUserByEmail(req.body.email)
  await friendsUtils.checkForExistingRequest(req.body.userId)
  await FriendRequest.create({
    from: req.body.userId,
    to: toUserId._id.toString(),
  })
  res.status(200).json({
    status: "success",
    message: "Friend request sent successfully",
  })
})

exports.getAllFriendRequests = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  const friendRequests = await FriendRequest.find({ to: req.body.userId })
    .populate("from", "name")
    .lean()

  res.status(200).json({
    status: "success",
    data: friendRequests,
  })
})

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id

  await FriendRequest.findOneAndDelete({
    from: req.body.from,
    to: req.body.userId,
  })
  await friendsUtils.addFriendBothWays(req.body.userId, req.body.from)
  res.status(200).json({
    status: "success",
    message: "Friend accepted",
  })
})

exports.rejectFriendRequest = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await FriendRequest.findOneAndDelete({
    from: req.body.from,
    to: req.body.userId,
  })

  res.status(200).json({
    status: "success",
  })
})

exports.deleteFriend = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await friendsUtils.deleteFriendBothWays(req.body.userId, req.body.friendId)
  res.status(200).json({
    status: "success",
  })
})
