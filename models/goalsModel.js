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
  data: {
    type: Date,
    default: Date.now(),
  },
  dueDateActive: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  overDue: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  shared: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    default: "ungrouped",
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
