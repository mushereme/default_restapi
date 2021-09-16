/**
 * logger
 */
exports.logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.hostname}${req.originalUrl}`.cyan)
    next()
}

const rfs = require('rotating-file-stream')
const path = require('path')

/**
 * access log 
 */
exports.accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, '../log')
})