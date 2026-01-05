const jwtUtils = require("../utils/jwt")

const authOptionalMiddleware = (req, res, next) => {
    const rawToken = req.headers.authorization || null

    if(!rawToken){
        req.user = null
        return next()
    }

    try{
        const parsedToken = jwtUtils.parseToken(rawToken)
        const decodedPayload = jwtUtils.validateAuthToken(parsedToken)

        req.user = decodedPayload
    } catch(error){
        req.user = null
        return next()
    }

    next()
}

module.exports = authOptionalMiddleware