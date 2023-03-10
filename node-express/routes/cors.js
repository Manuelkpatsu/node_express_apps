const cors = require('cors')

const whitelist = ['http://localhost:3000', 'http://localhost:3443', 'http://localhost:4200', 'http://emmanuelnartey:4200']
const corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionsDelegate)
