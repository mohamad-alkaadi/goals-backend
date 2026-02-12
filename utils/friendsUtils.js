const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestsModel");
const resUtils = require("../utils/resUtils");

exports.findUserByEmail = async (res, email) => {
  const userId = await User.findOne({ email: email });
  if (!userId) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "no user with this email"
    );
    return false;
  }
  return userId;
};

exports.findUserEmailById = async (res, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "no user with this id"
    );
    return false;
  }
  return user.email;
};

exports.findUserNameById = async (res, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "no user with this id"
    );
    return false;
  }
  return user.name;
};

exports.checkForExistingRequest = async (res, userOne, userTwo) => {
  const requestAlreadySent = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  });
  if (requestAlreadySent) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "request already sent"
    );
    return false;
  }

  const requestAlreadyReceived = await FriendRequest.findOne({
    from: userOne,
    to: userTwo,
  });
  if (requestAlreadyReceived) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "request already received"
    );
    return false;
  }
};

exports.addFriendBothWays = async (user1, user2) => {
  await User.findByIdAndUpdate(user1, {
    $addToSet: { friends: user2 },
  });
  await User.findByIdAndUpdate(user2, {
    $addToSet: { friends: user1 },
  });
};

const deleteFriendRequest = async (user1, user2) => {
  console.log("hi");

  await FriendRequest.findOneAndDelete({
    from: user1,
    to: user2,
  });
  await FriendRequest.findOneAndDelete({
    from: user2,
    to: user1,
  });
};

exports.deleteFriendBothWays = async (user1, user2) => {
  await User.findByIdAndUpdate(user1, {
    $pull: { friends: user2 },
  });
  await User.findByIdAndUpdate(user2, {
    $pull: { friends: user1 },
  });

  await deleteFriendRequest(user1, user2);
};

exports.checkIfFriendshipExists = async (res, userOne, userTwo) => {
  const existingFriendship = await FriendRequest.findOne({
    $or: [
      { from: userOne, to: userTwo },
      { to: userOne, from: userTwo },
    ],
    status: "accepted",
  });

  if (existingFriendship) {
    await resUtils.sendResponseWithoutData(
      res,
      400,
      "fail",
      "you are already friends"
    );
    return false;
  }
};

exports.getSentAndReceivedFriendRequests = async (userId) => {
  const receivedFriendRequestsRaw = await FriendRequest.find({
    to: userId,
    status: "pending",
  })
    .populate("from", "name")
    .populate("to", "name")
    .lean()
    .select("from");

  const receivedFriendRequests = receivedFriendRequestsRaw.map((req) => {
    return { _id: req.from._id.toString(), name: req.from.name, email: req.from.email };
  });

  const sentFriendRequestsRaw = await FriendRequest.find({
    from: userId,
    status: "pending",
  })
    .populate("from", "name")
    .populate("to", "name")
    .lean()
    .select("to");

  const sentFriendRequests = sentFriendRequestsRaw.map((req) => {
    return { _id: req.to._id.toString(), name: req.to.name, email: req.to.email };
  });

  return { receivedFriendRequests, sentFriendRequests };
};
