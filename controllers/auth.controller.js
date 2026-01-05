const authServices = require("../services/auth.services")

const validateCredentials = (username, password) => {
    if(!username || !username.trim() || typeof username !== "string")
        throw {status: 400, message: "Nombre de usuario inválido o inexistente"}

    if(username.length > 15) 
        throw {status: 400, message: "Nombre de usuario debe ser menor o igual a 15 carácteres"}

    if(!password || !password.trim() || typeof password !== "string")
        throw {status: 400, message: "Contraseña inválida inexistente"}
}

const loginController = async(req, res, next) => {
    const username = req.body.username || null
    const password = req.body.password || null

    validateCredentials(username, password)

    try{
        const result = await authServices.loginService(username, password)

        res.setHeader("Set-Cookie", `refreshToken=${result.refreshToken}; HttpOnly; Max-Age=2592000; SameSite=Lax; Path=/;`)

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: result.token
        })
    } catch(error){
        next(error)
    }
}

const registerController = async(req, res, next) => {
    const username = req.body.username || null
    const password = req.body.password || null

    validateCredentials(username, password)

    try{
        await authServices.registerService(username, password)

        return res.status(201).json({
            success: true,
            message: "Registro de usuario exitoso"
        })
    } catch(error){
        next(error)
    }
}

const logoutController = async(req, res, next) => {
    const rawRefreshToken = req.headers.cookie || null

    if(!rawRefreshToken) return next({status: 401, message: "No autenticado"})

    try{
        await authServices.logoutService(rawRefreshToken)

        res.setHeader("Set-Cookie", "refreshToken=; HttpOnly; Max-Age=2592000; SameSite=Lax; Path=/;")

        return res.sendStatus(204)
    } catch(error){
        next(error)
    }
}

const refreshController = async(req, res, next) => {
    const rawRefreshToken = req.headers.cookie || null
    
    if(!rawRefreshToken) return next({status: 401, message: "No autenticado"})

    try{
        const result = await authServices.refreshService(rawRefreshToken)

        res.setHeader("Set-Cookie", `refreshToken=${result.newRefreshToken}; HttpOnly; Max-Age=2592000; SameSite=Lax; Path=/;`)

        return res.status(200).json({
            success: true,
            message: "Refresh exitoso",
            data: result.token
        })
    } catch(error){
        next(error)
    }
}

module.exports = {loginController, registerController, refreshController, logoutController}