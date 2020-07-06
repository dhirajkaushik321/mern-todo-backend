const express = require('express')
const {signup,login} =require('../controller/user')
const { check } = require('express-validator')
const router = express.Router()

//User signup route
router.post('/signup',
[
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({min:6})
],
signup)

//User Login route
router.post('/login',
login
)
module.exports=router