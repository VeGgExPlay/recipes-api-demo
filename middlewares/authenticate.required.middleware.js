const jwtUtils = require("../utils/jwt")

const authRequiredMiddleware = (req, res, next) => {
    const rawToken = req.headers.authorization || null

    if(!rawToken) return next({status: 401, message: "No autenticado"})

    try{
        const parsedToken = jwtUtils.parseToken(rawToken)
        const decodedPayload = jwtUtils.validateAuthToken(parsedToken)

        req.user = decodedPayload
    } catch(error) {
        next({status: error.code || 401, message: error.message || "No autenticado"})
    }

    next()
}

module.exports = authRequiredMiddleware