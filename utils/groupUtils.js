const groupsModel = require("../models/groupsModel.js")
//this function takes req and extracts from it body.groupName and body.userId
// it create a new group or it finds an existent one
// returns the group Id
exports.findOrCreateGroup = async (req) => {
  const group = await groupsModel.findOneAndUpdate(
    { userId: req.body.userId, name: req.body.groupName },
    { $setOnInsert: { name: req.body.groupName, userId: req.body.userId } },
    { upsert: true, new: true }
  )
  return group._id
}
