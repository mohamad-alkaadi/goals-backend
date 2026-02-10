const groupsModel = require("../models/groupsModel")
const catchAsync = require("../utils/catchAsync")

exports.createNewGroup = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id
  req.body.slug = req.body.name.replaceAll(" ", "-")

  const newGroup = await groupsModel.create(req.body)

  res.status(200).json({
    status: "success"
  })
})

exports.getAllGroups = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id

  const newGroup = await groupsModel.find({ userId: req.body.userId })

  res.status(200).json({
    status: "success",
    data: newGroup
  })
})
