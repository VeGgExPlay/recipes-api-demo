const Recipe = require("../models/recipe.model")

const getAllRecipesService = async(isAdmin, page, limit) => {
    const skip = (page - 1) * limit

    const getFindQuery = (params = {}) => {
        if(!isAdmin){
            return Recipe.find(params)
        }

        return Recipe.findWithDeleted(params)
    }
    
    const getCountQuery = (params = {}) => {
        if(!isAdmin){
            return Recipe.countDocuments(params)
        }

        return Recipe.countDocumentsWithDeleted(params)
    }

    const [recipes, total] = await Promise.all([
        getFindQuery({isDemo: true})
            .select("title createdBy createdAt")
            .skip(skip)
            .limit(limit)
            .sort({createdAt: 1}),

        getCountQuery({isDemo: true})
    ])

    const totalPages = Math.ceil(total / limit)

    return {
        recipes: recipes,
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

const getRecipeService = async(isAdmin, id) => {
    const getFindQuery = (params = {}) => {
        if(!isAdmin){
            return Recipe.findOne(params)
        }
        return Recipe.findOneWithDeleted(params)
    }

    const recipe = await getFindQuery({_id: id, isDemo: true}).select("-isDemo -isDeleted -deletedAt")

    if(!recipe || recipe.length === 0) throw {status: 404, message: "Receta no encontrada"}

    return recipe
}

const createRecipeService = async(userId, data = {}) => {
    const recipeInDb = await Recipe.create({
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        cookTimeInSeconds: data.cookTimeInSeconds,
        createdBy: userId
    })

    return {_id: recipeInDb._id, title: recipeInDb.title, createdAt: recipeInDb.createdAt}
}

const updateRecipeService = async(isAdmin, userId, id, data = {}) => {
    const updateData = {}
    const searchParams = {
        isDemo: true
    }

    if(data.title) updateData.title = data.title
    if(data.description) updateData.description = data.description
    if(data.ingredients) updateData.ingredients = data.ingredients
    if(data.cookTimeInSeconds) updateData.cookTimeInSeconds = data.cookTimeInSeconds
    if(typeof data.isDeleted === "boolean" && isAdmin) updateData.isDeleted = data.isDeleted

    if(!isAdmin) searchParams._id = id

    if(!isAdmin) searchParams.createdBy = userId

    const getFindQuery = (params = {}) => {
        if(!isAdmin){
            return Recipe.findOne(params)
        }

        return Recipe.findOneWithDeleted(params)
    }

    const recipeInDb = await getFindQuery(searchParams)

    if(!recipeInDb) throw {status: 404, message: "Receta no encontrada"}

    await Recipe.updateOne(searchParams, updateData)
}

const deleteRecipeService = async(isAdmin, userId, id) => {
    const searchParams = {
        _id: id
    }

    if(!isAdmin) searchParams.createdBy = userId

    const getFindQuery = (params = {}) => {
        if(!isAdmin){
            return Recipe.findOne(params)
        }

        return Recipe.findOneWithDeleted(params)
    }

    const deletedRecipe = await getFindQuery(searchParams)

    if(!deletedRecipe) throw {status: 404, message: "Receta no encontrada"}

    deletedRecipe.isDeleted = true
    deletedRecipe.deletedAt = new Date()
    await deletedRecipe.save()
}

module.exports = {getAllRecipesService, getRecipeService, createRecipeService, updateRecipeService, deleteRecipeService}