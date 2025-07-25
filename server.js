const dotenv = require("dotenv")
const mongoose = require("mongoose")
dotenv.config({ path: "./config.env" })
const app = require("./app")

const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.caxv9ev.mongodb.net/?retryWrites=true&w=majority&appName=main`
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
}
async function connectToMongoDB() {
  try {
    await mongoose.connect(dbUri, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log("connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit()
  }
}
connectToMongoDB()
const port = process.env.PORT || 3000
// const port = 3000
app.listen(port, () => [console.log(`server is running on port ${port}`)])
