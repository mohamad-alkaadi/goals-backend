const express = require("express")
const app = express()
app.use(express.json())

const userRoutes = require("./routes/userRoutes")
const testRoutes = require("./routes/testRoutes")
const goalsRoutes = require("./routes/goalsRoutes")
const globalErrorHandler = require("./controllers/errorController")
const AppError = require("./utils/appError")
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/test", testRoutes)
app.use("/api/v1/goals", goalsRoutes)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on ths server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
