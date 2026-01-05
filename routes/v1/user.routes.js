const express = require("express")
const userController = require("../../controllers/user.controller")

const authenticateRquiredMiddleware = require("../../middlewares/authenticate.required.middleware")
const authorizeMiddleware = require("../../middlewares/authorize.middleware")

const router = express.Router()

router.get("/profile", authenticateRquiredMiddleware, userController.getProfileController)
router.patch("/profile", authenticateRquiredMiddleware, userController.updateProfileController)

router.get("/", authenticateRquiredMiddleware, authorizeMiddleware("admin"), userController.getAllUsersController)
router.patch("/:id", authenticateRquiredMiddleware, authorizeMiddleware("admin"), userController.updateUserController)
router.delete("/:id", authenticateRquiredMiddleware, authorizeMiddleware("admin"), userController.deleteUserController)

module.exports = router