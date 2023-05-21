const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages')
const { generateLocation } = require('./utils/messages')
const { addUser, removeUSer, getUSer, getUSerInRoom } = require('./utils/user')
const app = express()
const server = http.createServer(app)
const io = socketio(server)



const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))





io.on('connection', (socket) => {
    console.log('client detected')


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username: username, room: room })
        if (error) {
            return callback(error)
        }


        socket.join(user.room)
        
        socket.emit('message', generateMessage('Welcome', 'Admin'))

        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUSerInRoom(user.room)
        })

        callback()
    })






    socket.on('sendMessage', (message, callback) => {
        const user = getUSer(socket.id)
        if (user)
            io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })







    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        const user = getUSer(socket.id)
        if (user)
            io.to(user.room).emit('locationMessage', generateLocation(latitude, longitude, user.username))
        callback()
    })







    socket.on('disconnect', () => {
        const user = removeUSer(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the chat`, 'Admin'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUSerInRoom(user.room)
            })
        }
    })
})






server.listen(3000, () => {
    console.log('server is running')
})