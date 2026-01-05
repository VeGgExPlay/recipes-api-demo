const logger = require("../utils/logger")

const errorMiddleware = (error, req, res, next) => {
    logger.error("Unhandled error", error)

    return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Mensaje no definido",
        error: error.error || "Error no definido"
    })
}

module.exports = errorMiddleware