const mongoose = require("mongoose")

const goalsSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 255,
    required: [true, "a goal should have a title"],
  },
  description: {
    type: String,
    default: "",
  },
  goalType: {
    type: String,
    default: "unsorted",
  },
  data: {
    type: Date,
    default: Date.now(),
  },
  dueDateActive: {
    type: String,
    default: false,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  completed: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    default: "ungrouped",
  },
  userId: {
    type: String,
    required: [true, "you can't add a goal without user id"],
    select: false,
  },
})

const Goals = mongoose.model("Goals", goalsSchema)

module.exports = Goals
