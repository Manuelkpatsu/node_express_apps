const express = require('express')
const morgan = require('morgan')

const people = require('./routes/people')
const auth = require('./routes/auth')

const app = express()
const port = 3000

// app.use([logger, authorize])
app.use(morgan('tiny'))

// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())
// routes
app.use('/api/people', people)
app.use('/login', auth)

app.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>')
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})
