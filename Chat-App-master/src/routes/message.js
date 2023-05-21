const express = require('express')
const User = require('../models/user')
const router = new express.Router()

const addNewUser = (user)=>{
    const newUser = new User(user)
    
}