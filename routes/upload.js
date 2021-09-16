const express = require('express')
const router = express.Router()
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

const {
    upload,
    csv
} = require('../controller/upload')

router
    .route('/')
    .post(
        // multipartMiddleware,
        upload)

router
    .route('/csv')
    .post(csv)

module.exports = router

