const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    room:{
        type: String,
        required:true
    },
    socketid:{
        type: String,
        required:true
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User