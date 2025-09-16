const User = require("../models/userModel")
const FriendRequest = require("../models/friendRequestsModel")

exports.findUserByEmail = async (email, res) => {
  const userId = await User.findOne({ email: email })
  if (!userId) {
    res.status(400).json({
      status: "fail",
      message: "no user with this email",
    })
  }
  return userId
}

exports.checkForExistingRequest = async (userOne, userTwo, res) => {
  const requestAlreadySent = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  })
  if (requestAlreadySent) {
    res.status(400).json({
      status: "fail",
      message: "request already sent",
    })
  }
  const requestAlreadyReceived = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  })
  if (requestAlreadyReceived) {
    res.status(400).json({
      status: "fail",
      message: "request already received",
    })
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
  console.log("userOne:", userOne)
  console.log("userTwo:", userTwo)

  const existingFriendship = await FriendRequest.findOne({
    $or: [
      { from: userOne, to: userTwo },
      { to: userOne, from: userTwo },
    ],
    status: "accepted",
  })
  if (existingFriendship) {
    res.status(400).json({
      status: "fail",
      message: "you are already friends",
    })
  }
}
