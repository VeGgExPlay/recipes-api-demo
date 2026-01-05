const express = require("express")
const authRoutes = require("./routes/v1/auth.routes")
const userRoutes = require("./routes/v1/user.routes")
const recipeRoutes = require("./routes/v1/recipe.routes")
const cleanupDemoData = require("./cron/cleanup.demo.data")
const cleanupRefreshTokens = require("./cron/cleanup.refresh.tokens")
const rateLimiter = require("./limiters/rate.limiter")

cleanupDemoData()
cleanupRefreshTokens()

// Middlewares personalizados
const errorMiddleware = require("./middlewares/error.middleware")

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    const allowedOrigins = ["http://localhost:5173"]
    const origin = req.headers.origin

    if(allowedOrigins.includes(origin)){
        res.setHeader("Access-Control-Allow-Origin", origin)
    }

    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if(req.method === "OPTIONS"){
        return res.sendStatus(204)
    }

    next()
})

app.use("/api/v1/auth", rateLimiter.authLimiter, authRoutes)
app.use("/api/v1/user", rateLimiter.generalLimiter, userRoutes)
app.use("/api/v1/recipe", rateLimiter.generalLimiter, recipeRoutes)

app.use((req, res, next) => {
    next({status: 404, message: "Ruta no definida"})
})

app.use(errorMiddleware)

module.exports = app