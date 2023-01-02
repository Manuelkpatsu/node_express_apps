const express = require('express')
const http = require('http')
const morgan = require('morgan')
const mongoose = require('mongoose')

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

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

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
