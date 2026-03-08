const userModel = require("../models/userModel.js")
const catchAsync = require("../utils/catchAsync")
const userUtils = require("../utils/userUtils.js")


exports.getUserDetails = catchAsync(async (req, res, next) => {
  const id = req.user._id
  const userDetails = await userModel.findOne({ _id: id })
  const initials = userUtils.getInitials(userDetails.name)

  res.status(200).json({
    status: "success",
    data: {
      name: userDetails.name,
      email: userDetails.email,
      initials
    },
  })
})
