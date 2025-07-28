const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "A user must have a name!"],
  },
  email: {
    type: String,
    require: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    require: [true, "A user must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "A user should have a confirmed password"],
    validate: {
      validator: function (el) {
        return el === this.password
      },
    },
    message: "Passwords are not the same!",
  },
  passwordChangedAt: {
    type: Date,
  },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.isPasswordCorrect = async function (
  inputtedPassword,
  storedPassword
) {
  return await bcrypt.compare(inputtedPassword, storedPassword)
}

userSchema.methods.isPasswordChangedAfterTokenIssued = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseFloat(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }
  return false
}

const User = mongoose.model("User", userSchema)

module.exports = User
