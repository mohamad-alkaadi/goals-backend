const goalsModel = require("../models/goalsModel")
const catchAsync = require("../utils/catchAsync")
const groupUtils = require("../utils/groupUtils.js")
const goalsUtils = require("../utils/goalsUtils.js")
const friendsUtils = require("../utils/friendsUtils.js")

exports.createNewGoal = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  //req.body.groupId = await groupUtils.findOrCreateGroup(req)
  //console.log("findOrCreateGroup: ", findOrCreateGroup)
  if (req.body.shared)
    req.body.sharedWithName = await friendsUtils.findUserNameById(res, req.body.sharedWith)

  const newGoal = await goalsModel.create(req.body)
  if (req.body.shared) {
    const tempId = req.body.userId
    req.body.userId = req.body.sharedWith
    req.body.sharedWith = tempId
    req.body.sharedWithName = await friendsUtils.findUserNameById(res, req.body.sharedWith)

    await goalsModel.create(req.body)
  }
  res.status(200).json({
    status: "success",
    data: newGoal,
  })
})

exports.getAllGoals = catchAsync(async (req, res, next) => {
  await goalsUtils.checkForDueDate(req)
  const groupNameFromUrl = req.query.group
  let goals
  if (groupNameFromUrl === 'overdue')
    goals = await goalsModel.find({ userId: req.user._id, groupName: groupNameFromUrl })
  else if (groupNameFromUrl === 'shared')
    goals = await goalsModel.find({ userId: req.user._id, shared: true })
  else if (groupNameFromUrl === 'completed')
    goals = await goalsModel.find({ userId: req.user._id, completed: true })
  else
    goals = await goalsModel.find({ userId: req.user._id, groupName: groupNameFromUrl })

  res.status(200).json({
    status: "success",
    data: goals,
  })
})

exports.updateGoal = catchAsync(async (req, res, next) => {
  const updatedGoal = await goalsModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  )

  res.status(200).json({
    status: "success",
    data: updatedGoal,
  })
})

exports.getGoal = catchAsync(async (req, res, next) => {
  const goal = await goalsModel.findById(req.params.id)
  res.status(200).json({
    status: "success",
    data: goal,
  })
})
