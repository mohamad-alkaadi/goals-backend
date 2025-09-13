const User = require("../models/userModel")
const FriendRequest = require("../models/friendRequestsModel")
const catchAsync = require("../utils/catchAsync")

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

  const toUserId = await User.findOne({ email: req.body.email })
  if (!toUserId) {
    res.status(400).json({
      status: "fail",
      message: "no user with this email",
    })
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { from: req.body.userId, to: toUserId._id.toString() },
      { to: req.body.userId, from: toUserId._id.toString() },
    ],
  })
  if (existingRequest) {
    res.status(400).json({
      status: "fail",
      message: "A friend request already exists between these users",
    })
  }

  await FriendRequest.create({
    from: req.body.userId,
    to: toUserId._id.toString(),
  })
  res.status(200).json({
    status: "success",
    message: "Friend request sent successfully",
  })
})

exports.getFriendRequests = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  const friendRequests = await FriendRequest.find(
    { to: req.body.userId },
    { from }
  )
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
    to: req.userId,
  })
  await User.findByIdAndUpdate(req.body.userId, {
    $addToSet: { friends: req.body.from },
  })
  await User.findByIdAndUpdate(req.from, {
    $addToSet: { friends: req.body.userId },
  })
  res.status(200).json({
    status: "success",
  })
})

exports.rejectFriendRequest = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await FriendRequest.findOneAndDelete({
    from: req.body.from,
    to: req.userId,
  })

  res.status(200).json({
    status: "success",
  })
})
exports.deleteFriend = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  await User.findByIdAndUpdate(req.body.userId, {
    $pull: { friends: req.body.friendId },
  })
  res.status(200).json({
    status: "success",
  })
})
