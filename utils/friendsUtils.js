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
  console.log("existingFriendship:", existingFriendship)

  if (existingFriendship) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "you are already friends"
    )
  }
}
