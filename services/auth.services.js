const bcrypt = require("bcrypt")
const User = require("../models/user.model")

const jwtUtils = require("../utils/jwt")

const loginService = async(user, pass) => {
    const userInDb = await User.findOne({username: user}).select("username password refreshTokens role")

    if(!userInDb) throw {status: 400, message: "Nombre de usuario o contraseña incorrectos"}

    const match = await bcrypt.compare(pass, userInDb?.password)

    if(!match) throw {status: 400, message: "Nombre de usuario o contraseña incorrectos"}

    const payload = {_id: userInDb._id, username: userInDb.username, role: userInDb.role}

    const token = jwtUtils.signAuthToken(payload)
    const refreshToken = jwtUtils.signRefreshToken({_id: payload._id})

    userInDb.refreshTokens.push({token: refreshToken})
    await userInDb.save()

    return {token, refreshToken}
}

const registerService = async(user, pass) => {
    const userInDb = await User.findOne({username: user}).select("username")

    if(userInDb) throw {status: 409, message: "El usuario ya existe"}

    const hashedPassword = await bcrypt.hash(pass, 10)

    await User.create({
        username: user,
        password: hashedPassword,
        isDemo: true
    })
}

const logoutService = async(rawRefreshToken) => {
    const refreshToken = rawRefreshToken.split(";")[0].split("=")[1]

    const decodedPayload = jwtUtils.validateRefreshToken(refreshToken)

    const userInDb = await User.findOne({_id: decodedPayload._id}).select("username refreshTokens role")

    if(!userInDb) throw {status: 404, message: "No se encontró el usuario"}

    const tokenDoc = userInDb.refreshTokens.find({token: refreshToken})

    userInDb.refreshTokens.pull({_id: tokenDoc._id})
    await userInDb.save()
}

const refreshService = async(rawRefreshToken) => {
    const refreshToken = rawRefreshToken.split(";")[0].split("=")[1]

    const decodedPayload = jwtUtils.validateRefreshToken(refreshToken)

    const userInDb = await User.findOne({_id: decodedPayload._id, "refreshTokens.token": refreshToken})

    if(!userInDb) throw {status: 401, message: "Token expirado"}

    const tokenDoc = userInDb.refreshTokens.find(item => item.token === refreshToken)

    const payload = {_id: userInDb._id, username: userInDb.username, role: userInDb.role}
    
    const token = jwtUtils.signAuthToken(payload)
    const newRefreshToken = jwtUtils.signRefreshToken({_id: userInDb._id})
    
    userInDb.refreshTokens.push({token: newRefreshToken})

    userInDb.refreshTokens.pull({_id: tokenDoc._id})
    await userInDb.save()

    return {token, newRefreshToken}
}

module.exports = {loginService, registerService, logoutService, refreshService}