const { validationResult }=require('express-validator')
const mongoose=require('mongoose')
const HttpError = require('../models/http-error')
const User=require('../models/user')
const Todo = require('../models/todo')

const create=async (req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new HttpError('Invalid input,please try again',422)
        return next(error)
    }
    const {description}=req.body
    const creator=req.id
    let user
    try {
        user = await User.findById(creator)
    } catch (err) {
        const error = new HttpError('Creating todo failed', 500)
        return next(error)
    }
    if (!user) {
        const error = new HttpError('Could not find user', 404)
        return next(error)
    }
    const todo=new Todo({
        creator,
        description
    })
    try{
        const sess=await mongoose.startSession()
        sess.startTransaction()
        await todo.save({session: sess})
        user.todos.push(todo)
        await user.save({session: sess})
        await sess.commitTransaction()
        return res.status(201).json({message:"Todo created successfully",id:todo._id})
    }catch(err){
        const error=new HttpError('Creating place failed,please try again',500)
        return next(error)
    }
}

const get=async (req,res,next)=>{
    const creator=req.id
    try{
        const todos=await Todo.find({creator})
        res.json({todos:todos.map(todo =>todo.toObject({getters:true}))})
    }catch(err){
        const error = new HttpError('Something went wrong',500)
        next(error)
    }
}
const del=async (req,res,next)=>{
    const todo_id=req.params.todo_id
    let todo
    try {
    todo = await Todo.findById(todo_id).populate('creator')
    } catch (err) {
    const error = new HttpError('Something went wrong,cannot delete', 500)
    return next(error)
    }
    if (!todo) {
    const error = new HttpError('No todo found', 404)
    return next(error)
    }
    try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await todo.remove({ session: sess })
    todo.creator.todos.pull(todo)
    await todo.creator.save({ session: sess })
    await sess.commitTransaction()
    } catch (err) {
    const error = new HttpError('Something went wrong,cannot delete', 500)
    return next(error)
    }
    res.json({ message: 'Deleted todo' })
}

const update=async (req,res,next)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid input,please check your data', 422)
        return next(error)
    }
    const todo_id = req.params.todo_id
    const { description } = req.body
    let todo
    try {
        todo = await Todo.findById(todo_id)
    }
    catch (err) {
        const error = new HttpError('Something went wrong,could not update', 500)
        return next(error)
    }
    todo.description = description
    try {
        await todo .save()
    } catch (err) {
        const error = new HttpError('Something went wrong,could not update', 500)
        return next(error)
    }
    res.json({ message:"todo updated successfully"})
}

module.exports={create,del,update,get}