//  #     #    #    ### #     # 
//  ##   ##   # #    #  ##    # 
//  # # # #  #   #   #  # #   # 
//  #  #  # #     #  #  #  #  # 
//  #     # #######  #  #   # # 
//  #     # #     #  #  #    ## 
//  #     # #     # ### #     # 

const asyncHandler = require('express-async-handler')
const MyError = require('../utils/myError')
const paginate = require('../utils/paginate-sequelize')
const sendEmail = require('../utils/email')
const sendSMS = require('../utils/sms')
const public_ip = require('public-ip')
const crypto = require('crypto')
const moment = require('moment')
const { now } = require('../utils/moment')
const { Op } = require('sequelize')

// var cookieOptions =  {
//     expires: moment().add(2, 'h').utc(8).toDate(),
//     httpOnly: process.env.COOKIE_ENV === 'development' ? true : true,
//     secure: process.env.COOKIE_ENV === 'development' ? false : true, 
//     sameSite: 'none', 
// }

const getCookieOptions = () => {
    return {
        expires: moment().add(2, 'h').utc(8).toDate(),
        httpOnly: process.env.COOKIE_ENV === 'development' ? true : false,
        secure: process.env.COOKIE_ENV === 'development' ? false : true, 
        sameSite: process.env.COOKIE_ENV === 'development' ? null : 'none', 
    }
}

//   #####  ######  #######    #    ####### #######
//  #     # #     # #         # #      #    #       
//  #       #     # #        #   #     #    #       
//  #       ######  #####   #     #    #    #####  
//  #       #   #   #       #######    #    #       
//  #     # #    #  #       #     #    #    #       
//   #####  #     # ####### #     #    #    ####### 




// var cookieOptions = {
//     expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
//     httpOnly: true,
// }

exports.createUser = asyncHandler(async (req, res, next) => {

    req.body.action = "create user";
    req.body.action = "create user"
    req.body.ip = await public_ip.v4()
//    req.body.createdAt = now()
//    req.body.updatedAt = now()

    const user = await req.db.user.create(req.body)
    
    user.password = ''

    res.status(200).json({
        success: true,
        data: user
    })
})

//  #     # ######  ######     #    ####### ####### 
//  #     # #     # #     #   # #      #    #       
//  #     # #     # #     #  #   #     #    #       
//  #     # ######  #     # #     #    #    #####   
//  #     # #       #     # #######    #    #       
//  #     # #       #     # #     #    #    #       
//   #####  #       ######  #     #    #    ####### 

exports.updateUser = asyncHandler(async (req, res, next) => {

    req.body.action = "update user"
    req.body.ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

    let user = await req.db.user.findByPk(req.params.id) 

    if(!user) {
        throw new MyError(`${req.params.id} ID ?????? ?????????????????? ??????????????????`, 400)
    }

    user = await user.update(req.body)

    res.status(200).json({
        success: true,
        data: user
    })
})

//  ######  #######  #####  ####### ######  ####### #     # 
//  #     # #       #     #    #    #     # #     #  #   #  
//  #     # #       #          #    #     # #     #   # #   
//  #     # #####    #####     #    ######  #     #    #    
//  #     # #             #    #    #   #   #     #    #    
//  #     # #       #     #    #    #    #  #     #    #    
//  ######  #######  #####     #    #     # #######    #    

exports.destroyUser = asyncHandler(async (req, res, next) => {

    let user = await req.db.user.findByPk(req.params.id) 

    if(!user) {
        // // console.log('i am here')
        throw new MyError(`${req.params.id} ID ?????? ?????????????????? ??????????????????`, 400)
    }

    user = await user.destroy(req.body)

    res.status(200).json({
        success: true,
        data: user
    })
})

//   #####  ####### ####### 
//  #     # #          #    
//  #       #          #    
//  #  #### #####      #    
//  #     # #          #    
//  #     # #          #    
//   #####  #######    #    

exports.getUser = asyncHandler(async (req, res, next) => {

    // // console.log(req.params.id)
    // // console.log(req.db)

    let user = await req.db.user.findByPk(req.params.id) 
    // // console.log(user)
    if(!user) {
        // // console.log('i am here')
        throw new MyError(`${req.params.id} ID ?????? ?????????????????? ??????????????????`, 400)
    }

    res.status(200).json({
        success: true,
        data: user
    }) 
})

//    ##   #      #          ####   ####  #    # #    # ###### #    # #####  ####  
//   #  #  #      #         #    # #    # ##  ## ##  ## #      ##   #   #   #      
//  #    # #      #         #      #    # # ## # # ## # #####  # #  #   #    ####  
//  ###### #      #         #      #    # #    # #    # #      #  # #   #        # 
//  #    # #      #         #    # #    # #    # #    # #      #   ##   #   #    # 
//  #    # ###### ######     ####   ####  #    # #    # ###### #    #   #    ####  

exports.getAllUser = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort
    let select = req.query.select
    
    if(select) {
        select = select.split(',')
    }

    var remfromquery = ["select", "sort", "page", "limit"]
    remfromquery.forEach((el) => delete req.query[el]);

    const pagination = await paginate(page, limit, req.db.user)

    let query = {
        offset: pagination.start - 1,
        limit
    }

    if(req.query) {
        query.where = req.query
    }

    if(select) {
        query.attributes = select
    }

    if(sort) {
        query.order = sort.split(',').map(el => [el.charAt(0) === '-' ? el.substring(1): el, el.charAt(0) !== '-' ? 'ASC' : 'DESC'])
    }

    let user = await req.db.user.findAll(query) 

    res.status(200).json({
        success: true,
        // query: query, //query debuggin
        data: user,
        pagination: pagination
    })
})

//  #       #######  #####  ### #     # 
//  #       #     # #     #  #  ##    # 
//  #       #     # #        #  # #   # 
//  #       #     # #  ####  #  #  #  # 
//  #       #     # #     #  #  #   # # 
//  #       #     # #     #  #  #    ## 
//  ####### #######  #####  ### #     # 

exports.login = asyncHandler(async (req, res, next) => {
    
    // console.log("REQ BODY: ", req.body)

    const { email, password } = req.body

    // ?????????????? ??????????????
    if(!email || !password) {
        throw new MyError("Enter email and password", 400)
    }

    //???????????? ???????????????????????? ??????????
    const user = await req.db.user.scope('withPassword').findOne({ where: { email: email} })
    // console.log("USER IS HERE: ", user.dataValues.email);

    if(!user) {
        throw new MyError('User not found', 400)
    }

    const ok = await user.checkPassword(password)

    // console.log("OK: ", ok);

    if(!ok) {
        throw new MyError("??-???????? ?????????? ???????? ???? ?????????????????? ??????????.", 401)
    }

    const token = user.getJsonWebToken()

    // console.log("TOKEN :", token);
   
    const token = user.getJsonWebToken()

    // user.ip = await public_ip.v4()
    //    user.updatedAt = now()

    await user.save()

    user.password = ''

    
    var cookieOptions = getCookieOptions()
    
    // console.log("TOKEN IS HERE: ", token )
    // console.log(process.env.COOKIE_ENV)
    
    var cookieOptions = getCookieOptions()
    
    // console.log("COOKIE IS HERE: ", cookieOptions )

    res.status(200).cookie('token', token, cookieOptions).json({
        success: true,
        user,
    })
})

//  ######  #######  #####  ###  #####  ####### ####### ######  
//  #     # #       #     #  #  #     #    #    #       #     # 
//  #     # #       #        #  #          #    #       #     # 
//  ######  #####   #  ####  #   #####     #    #####   ######  
//  #   #   #       #     #  #        #    #    #       #   #   
//  #    #  #       #     #  #  #     #    #    #       #    #  
//  #     # #######  #####  ###  #####     #    ####### #     # 

exports.register = asyncHandler(async (req, res, next) => {

    
    req.body.status = "9"
    
    var user = await req.db.user.create(req.body)

    const token = user.getJsonWebToken()

    user.ip = await public_ip.v4()

    await user.save()

    // const confirmationToken = user.generateConfirmationToken()

    // // console.log(confirmationToken)
    user.ip = await public_ip.v4()
    //    user.updatedAt = now()

    await user.save()

    // const confirmationLink = `${process.env.FRONTEND}/confirmation?token=${confirmationToken}`

    // const message = `???????? ?????????? ????? <br><br>???? ?????????????? ???????????????????????? ???????????? ?????????????????? ?????????????? ???????????? ????????????????. <br> ???????????? ???????????????????? ???????????? ?????????????????? ??????????????????????????????????: <br><br> <a href="${confirmationLink}">????????????????????????????</a><br><br>?????????? ???? ???????????? ?????????????????????? ?????? ???????????????? 75551919 ?????????????? ?????????????????? ?????????????????? ????.<br><br>???????????? ???????????? ??????????????????????????.`

    // await sendEmail({
    //     email: user.email,
    //     subject: '?????????????? ????????????',
    //     html: message
    // })

    user.password = null
    user.confirmationToken = null
    user.confirmationTokenExpire = null

    var cookieOptions = getCookieOptions()

    res.status(200).cookie('token', token, cookieOptions).json({
        success: true,
        // token,
        user
    })
    
})

//  #       #######  #####  ####### #     # ####### 
//  #       #     # #     # #     # #     #    #    
//  #       #     # #       #     # #     #    #    
//  #       #     # #  #### #     # #     #    #    
//  #       #     # #     # #     # #     #    #    
//  #       #     # #     # #     # #     #    #    
//  ####### #######  #####  #######  #####     #    

exports.logout = asyncHandler(async (req, res, next) => {

    cookieOption = {
        expires: moment().subtract(2, 'h').utc(8).toDate(),
        httpOnly: false,
        secure: true,
        sameSite: 'none', 
    }

    // cookieOption = {
    //     expires: new Date(Date.now - 1000),
    //     httpOnly: true,
    //     secure: false, 
    // }

    res.status(200).cookie("token", null, cookieOption).json({
        success: true, 
        data: 'Logged out'
    })
})

//  ####### ####### ######   #####  ####### ####### 
//  #       #     # #     # #     # #     #    #    
//  #       #     # #     # #       #     #    #    
//  #####   #     # ######  #  #### #     #    #    
//  #       #     # #   #   #     # #     #    #    
//  #       #     # #    #  #     # #     #    #    
//  #       ####### #     #  #####  #######    #    

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    if(!req.body.email) {
        throw new MyError('???? ???????? ???? ?????????????? ??-???????? ???????????? ?????????????? ?????', 400)
    }

    const user = await req.db.user.findOne({where: {email: req.body.email}})

    if(!user) {
        throw new MyError(`${req.body.email}-?? ?????????????????? ?????????????????? ??????????????????`)
    }

    const resetToken = user.generatePasswordChangeToken()
    //    user.updatedAt = now()

    await user.save()

    const link = `${process.env.FRONTEND}/change-password?token=${resetToken}`

    const message = `???????? ?????????? ?????<br><br>???? ???????? ???????? ?????????? ???????????? ????????????????. <br>???????? ???????? ?????????? ???????????????????? ???????????? ???????????????????? ????: <br><br> <a href="${link}">???????? ???? ??????????????</a><br><br>???????????? ???????????? ??????????????????????????.`

    await sendEmail({
        email: user.email,
        subject: '???????? ???? ?????????????? ????????????',
        html: message
    })

    res.status(200).json({
        success: true, 
        resetToken,
    })

})

//  ######  #######  #####  ####### ####### 
//  #     # #       #     # #          #    
//  #     # #       #       #          #    
//  ######  #####    #####  #####      #    
//  #   #   #             # #          #    
//  #    #  #       #     # #          #    
//  #     # #######  #####  #######    #    

exports.resetPassword = asyncHandler(async (req, res, next) => {

    if(!req.body.resetToken || !req.body.password) {
        throw new MyError("???? ?????????? ?????????? ???????? ???? ???? ?????????????? ????.", 400)
    }
    
    const encryptedPassword = crypto.createHash('sha256').update(req.body.resetToken).digest('hex')

    const user = await req.db.user.findOne({where: {
        resetPasswordToken: encryptedPassword,
        resetPasswordExpire: {
            [Op.gt]: moment().utc(8).toDate()
        }
    }})

    if(!user) {
        throw new MyError("?????????? ???????????????? ??????????", 400)
    }

    user.password = req.body.password
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    //    user.updatedAt = now()

    user.save()

    const token = user.getJsonWebToken()

    var cookieOptions = getCookieOptions()

    res.status(200).cookie('token', token, cookieOptions).json({
        success: true, 
        // token,
    })
})
