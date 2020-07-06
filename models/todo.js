const mongoose=require('mongoose')
const Schema=mongoose.Schema
const todoSchema=new Schema(
    {
      description:{
          type:'string',
          required:true
      },
      creator:{
          type:Schema.Types.ObjectId,
          required:true,
          ref:'User'
      }
    }
)
const todoModel=mongoose.model('Todo',todoSchema)
module.exports=todoModel