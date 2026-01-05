const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async() => {
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("Conectado a mongodb")
    } catch(error){
        console.log("Error al conectar a la base de datos", error)
        process.exit(1)
    }
}

module.exports = connectDB