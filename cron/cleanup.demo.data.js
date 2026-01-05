const cron = require("node-cron")
const User = require("../models/user.model")
const Recipe = require("../models/recipe.model")

const cleanupDemoData = () => {
    cron.schedule("*/15 * * * *", async() => {
        try{
            await Recipe.deleteMany({isDemo: true})
            await User.deleteMany({isDemo: true})

            console.log("Limpieza completada")
        } catch(error) {
            console.log("Error", error)
        }
    })
}

module.exports = cleanupDemoData