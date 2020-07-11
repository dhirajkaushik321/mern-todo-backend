const { validationResult }=require('express-validator')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const config =require('config')
const User=require('../models/user')
const HttpError = require('../models/http-error')

    const signup=async (req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new HttpError('Invalid input,please try again',422)
        return next(error)
    }
    const {name,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,12)
        const user=new User({
        name,
        email,
        password:hashPassword
    })
       const userData= await user.save()
       const token =jwt.sign({id:userData.id},config.get('secret'),{expiresIn:"1d"})
        res.json({name,id:userData._id,token})
    }catch(err){
        const error=new HttpError('Server error',500)
        return next(error)
    }
    
}

//Login function
const login =async (req,res,next)=>{
    const {email,password}=req.body
    try{
        const identifiedUser=await User.findOne({email})
        if(!identifiedUser || ! await bcrypt.compare(password,identifiedUser.password)){
            const error=new HttpError('Invalid credentials',401)
            return next(error)
        }
        const token =jwt.sign({id:identifiedUser.id},config.get('secret'),{expiresIn:"1d"})
        res.json({name:identifiedUser.name,id:identifiedUser._id, token}) 
    }catch(err){
        const error=new HttpError('Server error',500)
        return next(error)
    }   
}

//uploadProfile function
const uploadProfile= async (req,res,next)=>{
    try{
    const user=await User.findById(req.id)
    user.avatar=req.file.buffer
    await user.save()
    res.send("successful")
    }
    catch(err){
        const error = new HttpError("Server error",500)
        return next(err)
    }
}

//Get Profile function
const getProfile =async (req,res,next)=>{
    try{
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
        const error = new HttpError('No avatar found',404)
        return next(error)
    }
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
}catch(err){
    const error = new HttpError('server error',500)
    return next(error)
}
}
module.exports={signup,login,uploadProfile,getProfile}