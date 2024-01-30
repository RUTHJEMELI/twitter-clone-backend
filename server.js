require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const corsOptions = require('./Config/corsOptions')
const { logger, logEvents } = require('./Middleware/logger')
const path = require('path')
const errorHandler = require('./Middleware/errorHandler')
const connectDB = require('./Config/config')
const cookieParser = require('cookie-parser')
connectDB()


const app = express()

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(logger)

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/api/auth', require('./Routes/authRoute'))
app.use('/api/posts', require('./Routes/postRoute'))
app.use('/api/users', require('./Routes/userRoute'))

app.all('*', (req, res) => {
    res.status(400)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message:'Not found'})
    } else {
        res.type('txt').send('not found')
    }
    
})
app.use(errorHandler)

const Port = process.env.PORT || 3500

mongoose.connection.once('open', () => {
    console.log('mongoDB connected')
    app.listen(Port, () => {
    console.log(`server is up and running on port ${Port}`)
})
})
mongoose.connection.on('error', err => {
    console.log(err)
 logEvents(`${err.no}\t${err.syscall}\t${err.name}\t${err.hostname}`, mongoErrorLog.log)
})