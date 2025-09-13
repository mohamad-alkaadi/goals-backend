const mongoose = require("mongoose")

const friendRequestsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "you cant send a friend request without a a sender id"],
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "you cant send a friend request without a a receiver id"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

friendRequestsSchema.index({ from: 1, to: 1 }, { unique: true })

const FriendRequest = mongoose.model("FriendRequest", friendRequestsSchema)

module.exports = FriendRequest
