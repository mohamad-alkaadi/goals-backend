const goalsModel = require("../models/goalsModel")
const goalsTypeModel = require("../models/goalsTypeModel")
const catchAsync = require("../utils/catchAsync")

exports.createNewGoal = catchAsync(async (req, res, next) => {
  console.log("sss")

  req.body.userId = req.user._id
  await goalsTypeModel.findOneAndUpdate(
    { name: req.body.goalType },
    { upsert: true, new: true }
  )
  const newGoal = await goalsModel.create(req.body)
  res.status(200).json({
    status: "success",
    data: { newGoal },
  })
})

// exports.getAllTodos = catchAsync(async (req, res, next) => {
//   const goals = await goalsModel.find({userId: req.user._id})
// })
