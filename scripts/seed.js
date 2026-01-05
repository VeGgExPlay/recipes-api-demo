const logger = require("../utils/logger")
const Recipe = require("../models/recipe.model")
const dotenv = require("dotenv")
const User = require("../models/user.model")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

dotenv.config()

const runSeed = async() => {
    await mongoose.connect(process.env.MONGO_URI)

    const adminExist = await User.findOne({role: "admin", isDemo: false})

    if(!adminExist){
        const hashedPassword = await bcrypt.hash("admin", 10)

        await User.create({
            username: "admin",
            password: hashedPassword,
            role: "admin",
            isDemo: false
        })

        logger.info("Admin creado", {
            username: "admin",
            role: "admin",
            isDemo: false
        })
    }

    await mongoose.disconnect()
}

runSeed()