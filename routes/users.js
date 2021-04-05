const express = require('express')
const router = express.Router()

const { protect, authorize } = require("../middlewares/protect")

const { 
    getAllUser,
    createUser,
    getUser,
    destroyUser,
    updateUser,
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
} = require('../controller/user')

router.route('/logout').get(logout)
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

router
    .route('/')
    .get(protect, getAllUser)
    .post(
        protect,
        authorize("0"), 
        createUser
    )

router
    .route('/:id')
    .get(protect, getUser)
    .delete(
        protect, 
        authorize("0"), 
        destroyUser)
    .put(
        protect, 
        authorize("0"), 
        updateUser
        )

module.exports = router