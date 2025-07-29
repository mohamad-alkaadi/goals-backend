const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new AppError("Bad request", 400))

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  })
})

exports.signin = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new AppError("Bad request", 400))

  const { email, password } = req.body

  if (!email || !password) {
    return next("Please provide email and password", 400)
  }
  const user = await User.findOne({ email }).select("+password")

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const promisifiedVerifyJWT = promisify(jwt.verify)

      const decodedToken = await promisifiedVerifyJWT(
        token,
        process.env.JWT_SECRET
      )
      if (user._id != decodedToken.id) {
        return next(new AppError("wrong token for user", 401))
      }

      currentTime = Math.floor(Date.now() / 1000)
      if (currentTime < decodedToken.exp) {
        return res.status(200).json({
          status: "success",
          token: token,
          name: user.name,
          email: user.email,
        })
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const newToken = signToken(user._id)
        return res.status(200).json({
          status: "success",
          token: newToken,
          name: user.name,
          email: user.email,
        })
      } else {
        return next(new AppError("Invalid token. Please log in again", 401))
      }
    }
  }
  token = signToken(user._id)

  res.status(200).json({
    status: "success",
    token,
    name: user.name,
    email: user.email,
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(
      new AppError("Your are not logged in! Please log in to get access", 401)
    )
  }
  const promisifiedVerifyJWT = promisify(jwt.verify)

  const decodedToken = await promisifiedVerifyJWT(token, process.env.JWT_SECRET)
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    )
  }
  if (user.isPasswordChangedAfterTokenIssued(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password! Please login again.", 401)
    )
  }
  req.user = user
  next()
})
