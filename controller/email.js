const MyError = require('../utils/myError')
const asyncHandler = require('express-async-handler')
const sendEmail = require('../utils/email')

exports.sendEmailReq = asyncHandler(async(req, res, next) => {

    await sendEmail({
        email: req.body.to,
        subject: req.body.subject,
        from: req.body.from,
        html: req.body.message
    })

    res.status(200).json({
        success: true,
        data: 'Та мэйл хаягаа шалгана уу.'
    })
})