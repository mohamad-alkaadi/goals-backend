const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const connectToMongoDB = require("./utils/dbConnect")
const app = require("./app")

const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main.caxv9ev.mongodb.net/?retryWrites=true&w=majority&appName=main`
connectToMongoDB(dbUri)

const port = process.env.PORT || 3000

app.listen(port, () => [console.log(`server is running on port ${port}`)])
