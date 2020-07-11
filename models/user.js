const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar:{
            type:Buffer
        },
        todos: [
            {
                type:Schema.Types.ObjectId,
                required: true,
                ref:'Todo'
            }
        ]
    }
)
const userModel = mongoose.model('User', userSchema)
module.exports = userModel