const mongoose = require("mongoose")

const groupsSchema = mongoose.Schema({
  name: {
    type: String,
    default: "ungrouped",
    unique: true
  },
  slug: {
    type: String,
    default: "ungrouped",
    unique: true
  },

  userId: {
    type: String,
    required: [true, "you can't add a goal without user id"],
    select: false,
  },
})

module.exports =
  mongoose.models.Groups || mongoose.model("Groups", groupsSchema)
