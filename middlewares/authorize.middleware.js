const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userData = req.user || null

        if(!userData) return next({status: 401, message: "No autenticado"})

        if(!allowedRoles.includes(userData.role)){
            return next({status: 403, message: "No autorizado"})
        }

        next()
    }
}

module.exports = authorize