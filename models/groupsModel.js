const mongoose = require("mongoose")

const groupsSchema = mongoose.Schema({
  name: {
    type: String,
    default: "ungrouped",
  },
  userId: {
    type: String,
    required: [true, "you can't add a goal without user id"],
    select: false,
  },
})
const Groups = mongoose.model("Goals", groupsSchema)

module.exports = Groups
