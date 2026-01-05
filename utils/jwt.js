const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

const parseToken = (rawToken) => {
    if(!rawToken) throw {status: 400, message: "Token no proporcionado"}

    if(!rawToken.startsWith("Bearer ")) throw {status: 400, message: "Token inválido"}

    const token = rawToken.slice(7)

    if(!token) throw {status: 400, message: "Token no proporcionado"}


    return token
}

const signAuthToken = (payload) => {
    if(!payload) throw {status: 400, message: "No hay carga útil"}

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "15m"})

    return token
}

const validateAuthToken = (token) => {
    if(!token) throw {status: 400, message: "Token no proporcionado"}

    const decodedToken = jwt.verify(token, JWT_SECRET)

    return decodedToken
}

const signRefreshToken = (payload) => {
    if(!payload || typeof payload !== "object") throw {status: 400, message: "No hay carga útil"}

    const token = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: "30d"})

    return token
}

const validateRefreshToken = (token) => {
    if(!token) throw {status: 400, message: "Token no proporcionado"}

    const decodedToken = jwt.verify(token, JWT_REFRESH_SECRET)

    return decodedToken
}

module.exports = {parseToken, signAuthToken, validateAuthToken, signRefreshToken, validateRefreshToken}