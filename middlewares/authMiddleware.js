const jwt = require("jsonwebtoken")
const MyError = require("../utils/myError")
require("dotenv").config()

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if(!token) {
        throw new MyError("Token not found", 400)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            throw new MyError("Unauthorized", 401)
        }
        // console.log('DECODED JWT: ', decoded)
        req.userId = decoded.id
        req.role = req.
        next()
    })
}
