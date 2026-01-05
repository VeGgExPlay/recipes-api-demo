const userServices = require("../services/user.services")

const getProfileController = async(req, res, next) => {
    const userData = req.user || null

    if(!userData) return next({status: 401, message: "No autenticado"})

    try{
        const result = await userServices.profileService(userData._id)

        return res.status(200).json({
            success: true,
            message: "Perfil consultado con éxito",
            data: result
        })
    } catch(error){
        next(error)
    }
}

const updateProfileController = async(req, res, next) => {
    const {username} = req.body || null
    const userData = req.user || null
    if(!userData) return next({status: 401, message: "No autenticado"})

    try{
        await userServices.updateProfileService(userData, {username})

        return res.status(200).json({
            success: true,
            message: "Perfil actualizado",
        })
    } catch(error){
        next(error)
    }
}

const getAllUsersController = async(req, res, next) => {
    const page = Math.max(req.query.page || 1, 1)
    const limit = Math.min(req.query.limit || 10, 50)

    try{
        const result = await userServices.getAllUsersService({page, limit})

        return res.status(200).json({
            success: true,
            message: "Usuarios recuperados con éxito",
            data: result
        })
    } catch(error){
        next(error)
    }
}

const updateUserController = async(req, res, next) => {
    const {id} = req.params || null
    const updateData = req.body || null
    const userData = req.user || null

    if(userData.role !== "admin") return next({status: 403, message: "No autorizado"})
    if(!id) return next({status: 400, message: "Id inválido o no proporcionado"})
        
    try{
        await userServices.updateUserService(id, updateData)

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado con éxito"
        })
    } catch(error) {
        next(error)
    }
}

const deleteUserController = async(req, res, next) => {
    const {id} = req.params || null
    const userData = req.user || null

    if(userData.role !== "admin") return next({status: 403, message: "No autorizado"})

    if(!id) return next({status: 400, message: "Id inválido o no proporcionado"})

    try{
        await userServices.deleteUserService(id)

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado con éxito"
        })
    } catch(error) {
        next(error)
    }
}

module.exports = {getProfileController, updateProfileController, getAllUsersController, updateUserController, deleteUserController}