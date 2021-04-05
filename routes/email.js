const express = require('express')
const router = express.Router()

const { protect, authorize } = require("../middlewares/protect")

const { 
    sendEmailReq
} = require('../controller/email')

router
    .route('/')
    .post(protect, authorize("0", "1"), sendEmailReq)


module.exports = router
