const path = require("path");
const asyncHandler = require('express-async-handler');
const MyError = require("../utils/myError");
const Converter = require('csvtojson').Converter

var csvConverter = new Converter({constructResult: false})

exports.upload = asyncHandler( async( req, res, next) => {

    // console.log('file ', req.files)
    
    const file = req.files.upload || req.files.file

    file.name =  `${new Date().getTime()}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
        if(err) {
            throw new MyError('Файл хуулах явцад алдаа гарлаа. Алдаа :' + err.message, 400)
        }

        res.status(200).json({
            success: true,
            uid: new Date().getTime(),
            name: file.name,
            status: 'done',
            uploaded: 1,
            fileName: file.name,
            url: process.env.BACKEND_URI + "/uploads/" + file.name
        })
    })
})

exports.csv = asyncHandler(async (req, res, next) => {

    // console.log(req.files.file)

    if(!req.files.file) {
        throw new MyError('Файл дамжуулна уу.', 400)
    }

    if(!req.files.file.mimetype === "text/csv") {
        throw new MyError('CSV файл дамжуулна уу.', 400)
    }

    file.name =  `${new Date().getTime()}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
        if(err) {
            throw new MyError('Файл хуулах явцад алдаа гарлаа. Алдаа :' + err.message, 400)
        }

        var url =  process.env.BACKEND_URI + "/uploads/" + file.name

        // console.log(url)

        var readStream = require('fs').createReadStream(url)

        csvConverter.on("end_parsed", jsonObj => {
            // console.log(jsonObj)
            
        })

        res.status(200).json({
            success: true,
            readStream,
            url
        })
    })
})  