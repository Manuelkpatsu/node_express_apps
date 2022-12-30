const express = require('express')
const http = require('http')
const morgan = require('morgan')

const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

const hostname = 'localhost'
const port = 3000
const app = express()

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
