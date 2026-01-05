const User = require("../models/user.model")
const mongoose = require("mongoose")

const profileService = async(userId) => {
    const result = await User.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(userId)}},
        {$lookup: {
            from: "recipes",
            let: {userId: "$_id"},
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {$eq: ["$createdBy", "$$userId"]},
                                {$eq: ["$isDeleted", false]}
                            ]
                        }
                    }
                }
            ],
            as: "recipesData"
        }},
        {$project: {
            username: 1,
            totalRecipes: {$size: "$recipesData"}
        }},
    ])

    if(!result) throw {status: 401, message: "Usuario no encontrado"}

    const userInDb = result[0] || null

    return userInDb
}

const updateProfileService = async(userData, updateData = {}) => {
    const parsedUpdateData = {}

    if(updateData?.username?.trim()) parsedUpdateData.username = updateData.username

    const userInDb = await User.findOne({_id: userData._id}).select("username isDemo role")

    if(!userInDb) throw {status: 401, message: "Usuario no encontrado"}

    if(!userInDb.isDemo || userInDb.role === "admin"){
        throw {status: 403, message: "Este recurso no puede ser modificado"}
    }
    
    userInDb.username = parsedUpdateData.username
    await userInDb.save()
}

const getAllUsersService = async({page, limit}) => {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
        User.findWithDeleted({isDemo: true})
            .select("-refreshTokens")
            .skip(skip)
            .limit(limit)
            .sort({createdAt: 1}),

        User.countDocumentsWithDeleted()
    ])

    const totalPages = Math.ceil(total / limit)

    return {
        users: users,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }
}

const updateUserService = async(id, data) => {
    let updateData = {}
    const searchParams = {
        _id: id,
        isDemo: true
    }

    if(data?.username?.trim()) updateData.username = data?.username
    if(typeof data.isDeleted) updateData.isDeleted = data.isDeleted

    const userInDb = await User.findOneWithDeleted(searchParams)

    if(!userInDb) throw {status: 404, message: "No se encontró al usuario"}

    if(!userInDb.isDemo || userInDb.role === "admin"){
        throw {status: 403, message: "Este recurso no puede ser modificado"}
    }

    await User.updateOne(searchParams, updateData)
}

const deleteUserService = async(id) => {
    const userInDb = await User.findOne({_id: id})

    if(!userInDb) throw {status: 404, message: "No se encontró al usuario"}

    if(!userInDb.isDemo || userInDb.role === "admin"){
        throw {status: 403, message: "Este recurso no se puede eliminar"}
    }

    userInDb.isDeleted = true
    userInDb.deletedAt = new Date()
    await userInDb.save()
}

module.exports = {profileService, updateProfileService, getAllUsersService, updateUserService, deleteUserService}