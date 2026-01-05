const recipeServices = require("../services/recipe.services")

const getAllRecipesController = async(req, res, next) => {
    const page = Math.max(req.query.page || 1, 1)
    const limit = Math.min(req.query.limit || 10, 50)
    const isAdmin = req.user?.role === "admin"

    try{
        const result = await recipeServices.getAllRecipesService(isAdmin, page, limit)

        return res.status(200).json({
            success: true,
            message: "Recetas recuperadas",
            data: result
        })
    } catch(error) {
        next(error)
    }
}

const getRecipeController = async(req, res, next) => {
    const {id} = req.params || null
    const isAdmin = req.user?.role === "admin"

    if(!id) return next({status: 400, message: "Id inválido o no proporcionado"})

    try{
        const result = await recipeServices.getRecipeService(isAdmin, id)

        return res.status(200).json({
            success: true,
            message: "Receta recuperada con éxito",
            data: result
        })
    } catch(error) {
        next(error)
    }
}

const createRecipeController = async(req, res, next) => {
    const {title, description, ingredients, cookTimeInSeconds} = req.body || null
    const userData = req.user || null

    if(!userData) return next({status: 401, message: "No autenticado"})

    if(!title || !title.trim() || typeof title !== "string")
        return next({status: 400, message: "Título inválido o no proporcionado"})

    if(!description || !description.trim() || typeof description !== "string")
        return next({status: 400, message: "Descripción inválida o no proporcionada"})

    if(!ingredients || ingredients.length === 0)
        return next({status: 400, message: "Título inválido o no proporcionado"})

    if(!cookTimeInSeconds || typeof cookTimeInSeconds !== "number")
        return next({status: 400, message: "Título inválido o no proporcionado"})

    try{
        const result = await recipeServices.createRecipeService(userData._id, {title, description, ingredients, cookTimeInSeconds})

        return res.status(201).json({
            success: true,
            message: "Receta creada con éxito",
            data: result
        })
    } catch(error) {
        next(error)
    }
}

const updateRecipeController = async(req, res, next) => {
    const {id} = req.params || null
    const {title, description, ingredients, cookTimeInSeconds, isDeleted} = req.body || null
    const isAdmin = req.user.role === "admin"
    const userData = req.user || null

    if(!id) return next({status: 400, message: "Id inválido o no proporcionado"})

    if(!userData) return next({status: 401, message: "No autenticado"})

    try{
        await recipeServices.updateRecipeService(isAdmin, userData._id, id, {title, description, ingredients, cookTimeInSeconds, isDeleted})

        return res.status(200).json({
            success: true,
            message: "Receta actualizada con éxito",
        })
    } catch(error) {
        next(error)
    }
}

const deleteRecipeController = async(req, res, next) => {
    const {id} = req.params || null
    const userData = req.user
    const isAdmin = req.user.role === "admin"

    if(!id) return next({status: 400, message: "Id inválido o no proporcionado"})

    try{
        await recipeServices.deleteRecipeService(isAdmin, userData._id, id)

        return res.status(200).json({
            success: true,
            message: "Receta eliminada con éxito"
        })
    } catch(error) {
        next(error)
    }
}

module.exports = {getAllRecipesController, getRecipeController, createRecipeController, updateRecipeController, deleteRecipeController}