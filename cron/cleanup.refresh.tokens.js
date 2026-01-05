const cron = require("node-cron")
const User = require("../models/user.model")

const cleanupRefreshTokens = () => {
    cron.schedule("*/15 * * * *", async() => {
        const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)

        try{
            await User.updateMany(
                {},
                {
                    $pull: {
                        refreshTokens: {
                            createdAt: {$lt: oneDayAgo}
                        }
                    }
                }
            )

            console.log("Tokens limpiados")
        } catch(error) {
            console.log("Error", error)
        }
    })
}

module.exports = cleanupRefreshTokens