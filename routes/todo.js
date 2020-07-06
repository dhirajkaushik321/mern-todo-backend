const express = require('express')
const {create, del ,get, update} =require('../controller/todo')
const { check } = require('express-validator')
const router = express.Router()
const Auth = require('../middleware/Auth')

//Create todo
router.post('/',
[   Auth,
    check('description').not().isEmpty()
]
,create)

//Get todos
router.get('/',Auth,get)

//Delete todo
router.delete('/:todo_id',Auth,del)

//Update todo
router.patch('/:todo_id',Auth,update)
module.exports=router