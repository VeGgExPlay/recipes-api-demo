const rateLimit = require("express-rate-limit")

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Demasiados intentos, intenta más tarde"
})

const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
})

module.exports = {
    authLimiter,
    generalLimiter
}