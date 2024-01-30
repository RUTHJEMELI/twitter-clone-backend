const {logEvents} = require('../Middleware/logger')


const errorHandler = async(err, req, res, next) => {
await logEvents(`${err.name}:${err.message}\t${req.headers.origin}\t${req.url}\t${err.method}`, 'errLog.log')
    console.log(err.stack)
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)
    res.json({ message: err.message })
    next()
}

module.exports = errorHandler