const express = require('express')
const multer= require('multer')
const {signup,login,uploadProfile,getProfile} =require('../controller/user')
const { check } = require('express-validator')
const Auth = require('../middleware/Auth')
const router = express.Router()
const upload=multer({
    limits:{
        fileSize:5000000
    },
    fileFilter(req,file,cb){
        if(file.originalname.endsWith('.jpg') || file.originalname.endsWith('.png') || file.originalname.endsWith('.jpeg')){
           return  cb(undefined,true)
        }
        cb(new Error("Please upload a valid image"))
    }
})
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

//user profile upload route
router.post('/profile',Auth, upload.single('file'),uploadProfile,(err,req,res,next)=>{
    res.status(400).json({message:err.message})
})

//get profile route for
router.get('/:id/profile',getProfile)
module.exports=router