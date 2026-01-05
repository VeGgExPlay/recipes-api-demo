const log = (level, msg, meta = {}) => {
    const entry = {
        level,
        msg,
        ...meta,
        timestamp: new Date().toISOString()
    }

    console.log(JSON.stringify(entry))
}

module.exports = {
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta),
    debug: (msg, meta) => {
        if(process.env.NODE_ENV !== "production"){
            log("debug", msg, meta)
        }
    }
}