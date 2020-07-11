const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/db')
const HttpError= require('./models/http-error')
const userRouter=require('./routes/user')
const todoRouter=require('./routes/todo')
const PORT=process.env.PORT || 5000
const app=express()
app.use(cors())
dbConnect()
app.use(express.json())
app.use('/api/user',userRouter)
app.use('/api/todo',todoRouter)
app.use((req,res,next) =>{
    const err = new HttpError('Could not find this route',404)
    throw err
})
app.use((error,req,res,next)=>{
    console.log(error.message)
    if(res.headersSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'Unknown error'})
})
//creating server
app.listen(PORT, ()=>console.log("server is running on port "+PORT))