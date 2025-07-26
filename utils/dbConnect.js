const mongoose = require("mongoose")
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
}

async function connectToMongoDB(dbUri) {
  try {
    await mongoose.connect(dbUri, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log("database connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit()
  }
}

module.exports = connectToMongoDB
