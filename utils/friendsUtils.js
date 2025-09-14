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
  const existingRequest = await FriendRequest.findOne({
    $or: [
      { from: userOne, to: userTwo },
      { to: userOne, from: userTwo },
    ],
  })
  if (existingRequest) {
    res.status(400).json({
      status: "fail",
      message: "A friend request already exists between these users",
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
