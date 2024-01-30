const path = require('path')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromise = fs.promises
const {format}= require('date-fns')


const logEvents = async (message, logFile) => {
    const time = `${format(new Date(), 'yyyymmdd\tHH:mm:ss')}`
    const logItem = `${time}\t${uuid()}\t${message}`
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'))
        } 
        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', logFile), logItem)
    } catch (error) {
        console.log(error)
    }

}
const logger = async (req,res, next) => {
    await logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logger, logEvents}