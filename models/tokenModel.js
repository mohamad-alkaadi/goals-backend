const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    default: "ungrouped",
    unique: true
  },
  issuedAt: {
    type: Date,
    unique: true,
    default: Date.now()
  },
  loggedOut: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: [true, "you can't add a goal without user id"],
    select: false,
  },
})

module.exports =
  mongoose.models.Token || mongoose.model("Token", tokenSchema)
