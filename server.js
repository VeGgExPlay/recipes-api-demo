const dotenv = require("dotenv")
const connectDB = require("./db/db")
const app = require("./app")

dotenv.config()

const PORT = process.env.PORT

connectDB()

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})