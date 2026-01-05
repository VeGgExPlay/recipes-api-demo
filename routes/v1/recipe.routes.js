const express = require("express")

const recipesController = require("../../controllers/recipe.controller")
const authenticateMiddleware = require("../../middlewares/authenticate.required.middleware")
const authenticateOptionalMiddleware = require("../../middlewares/authenticate.optional.middleware")

const router = express.Router()

router.get("/", authenticateOptionalMiddleware, recipesController.getAllRecipesController)
router.get("/:id" ,authenticateOptionalMiddleware, recipesController.getRecipeController)

router.post("/", authenticateMiddleware, recipesController.createRecipeController)
router.patch("/:id", authenticateMiddleware, recipesController.updateRecipeController)
router.delete("/:id", authenticateMiddleware, recipesController.deleteRecipeController)

module.exports = router