const express = require("express")
const app = express()

const userRoutes = require("./routes/userRoutes")
const globalErrorHandler = require("./controllers/errorController")
const AppError = require("./utils/appError")
app.use("/api/v1/users", userRoutes)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on ths server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
