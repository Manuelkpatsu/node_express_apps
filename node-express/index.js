const express = require('express')
const http = require('http')
const morgan = require('morgan')
const mongoose = require('mongoose')
// const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
require('dotenv').config()

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const userRouter = require('./routes/userRouter')

const hostname = 'localhost'
const port = 3000
const app = express()
const url = 'mongodb://localhost:27017/conFusion'

mongoose.set('strictQuery', false)
const connect = mongoose.connect(url)

connect.then((db) => {
  console.log('Connected to server!')
}, (err) => { console.log(err) })

app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.use(cookieParser(process.env.SECRET_KEY))
app.use(session({
  name: process.env.SESSION_ID,
  secret: process.env.SECRET_KEY,
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

app.use('/users', userRouter)

function auth(req, res, next) {
  if (!req.session.user) {
    var err = new Error('You are not authenticated!')
    err.status = 403
    return next(err)
  } else {
    if (req.session.user === 'authenticated') {
      next()
    } else {
      var err = new Error('You are not authenticated!')
      err.status = 401
      next(err)
    }
  }
}

app.use(auth)

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : ''

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
