const jwt = require('jsonwebtoken')
const config = require('config')
const HttpError = require('../models/http-error')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const { id } = jwt.verify(token, config.get('secret'))
        const user = await User.findById(id)
        if (!user) {
            return res.status(401).json({ message: 'Please authenticate yourself'})
        }
        req.id = id
        req.token = token
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Please authenticate yourself'})

    }

}
module.exports = auth