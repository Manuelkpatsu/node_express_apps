const express = require('express')
const http = require('http')
const morgan = require('morgan')
const mongoose = require('mongoose')
// const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const createError = require('http-errors')
require('dotenv').config()

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const userRouter = require('./routes/userRouter')
const uploadRouter = require('./routes/uploadeRouter')
const favoriteRouter = require('./routes/favoriteRouter')
const commentRouter = require('./routes/commentRouter')

const hostname = 'localhost'
const port = 3000
const app = express()
const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)
const connect = mongoose.connect(url)

connect.then((db) => {
  console.log('Connected to server!')
}, (err) => { console.log(err) })

app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())

app.use('/users', userRouter)

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)
app.use('/imageUpload', uploadRouter)
app.use('/favorites', favoriteRouter)
app.use('/comments', commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
