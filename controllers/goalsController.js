const goalsModel = require("../models/goalsModel")
const goalsTypeModel = require("../models/goalsTypeModel")
const catchAsync = require("../utils/catchAsync")

exports.createNewGoal = catchAsync(async (req, res, next) => {

  req.body.userId = req.user._id
  await goalsTypeModel.findOneAndUpdate(
    { name: req.body.goalType },
    { upsert: true, new: true }
  )
  const newGoal = await goalsModel.create(req.body)
  res.status(200).json({
    status: "success",
    data:  newGoal ,
  })
})

exports.getAllTodos = catchAsync(async (req, res, next) => {
   const goals = await goalsModel.find({userId: req.user._id})
   res.status(200).json({
       status:"succes",
        data: goals
    })
})

exports.updateGoal = catchAsync(async (req, res, next) => {
	const updatedGoal = await goalsModel.findOneAndUpdate(
        {_id: req.params.id},
        req.body,   
        { new: true, runValidators: true })
	
    res.status(200).json({
        status: "sucess",
        data: updatedGoal
    })
})

exports.getGoal = catchAsync(async (req, res, next) => {
	const goal = await goalsModel.findById(req.params.id)
    res.status(200).json({
		status: "success",
        data: goal
    })
})
