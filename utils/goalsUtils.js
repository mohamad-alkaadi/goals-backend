const Goals = require("../models/goalsModel")

//this function checks for due date time a compare it to the current time and change the overdue to true if now is bigger
exports.checkForDueDate = async (req) => {
  await Goals.updateMany(
    {
      userId: req.body.user,
      dueDateActive: true,
      completed: false,
      date: { $lte: Date.now() },
    },
    {
      overDue: true,
    }
  )
}
