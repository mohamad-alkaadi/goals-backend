const mongoose = require("mongoose")

const goalsTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30,
    default: "unsorted",
  },
  userId: {
    type: String,
    required: [true, "you can't add a goal without user id"],
    select: false,
  },
})

const GoalsTypeModel = mongoose.model("GoalsType", goalsTypeSchema)

module.exports = GoalsTypeModel
