const User = require("../models/userModel")
const FriendRequest = require("../models/friendRequestsModel")
const resUtils = require("../utils/resUtils")

exports.findUserByEmail = async (res, email) => {
  const userId = await User.findOne({ email: email })
  if (!userId) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "no user with this email"
    )
    return false
  }
  return userId
}

exports.checkForExistingRequest = async (res, userOne, userTwo) => {
  const requestAlreadySent = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  })
  if (requestAlreadySent) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "request already sent"
    )
    return false
  }

  const requestAlreadyReceived = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  })
  if (requestAlreadyReceived) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "request already received"
    )
    return false
  }
}

exports.addFriendBothWays = async (user1, user2) => {
  await User.findByIdAndUpdate(user1, {
    $addToSet: { friends: user2 },
  })
  await User.findByIdAndUpdate(user2, {
    $addToSet: { friends: user1 },
  })
}

exports.deleteFriendBothWays = async (user1, user2) => {
  await User.findByIdAndUpdate(user1, {
    $pull: { friends: user2 },
  })
  await User.findByIdAndUpdate(user2, {
    $pull: { friends: user1 },
  })
}

exports.checkIfFriendshipExists = async (res, userOne, userTwo) => {
  const existingFriendship = await FriendRequest.findOne({
    $or: [
      { from: userOne, to: userTwo },
      { to: userOne, from: userTwo },
    ],
    status: "accepted",
  })

  if (existingFriendship) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "you are already friends"
    )
    return false
  }
}

exports.getSentAndReceivedFriendRequests = async (userId) => {
  const friendRequests = await FriendRequest.find({
    to: userId,
    status: "pending",
  })
    .populate("from", "name")
    .populate("to", "name")
    .lean()
  const pendingRequests = await FriendRequest.find({
    from: userId,
    status: "pending",
  })
    .populate("from", "name")
    .populate("to", "name")
    .lean()
  return { friendRequests, pendingRequests }
}
