const express = require("express")
const authController = require("../../controllers/auth.controller")

const router = express.Router()

router.post("/login", authController.loginController)
router.post("/register", authController.registerController)
router.post("/logout", authController.logoutController)
router.post("/refresh", authController.refreshController)

module.exports = router