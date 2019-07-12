const express = require('express')
const app = express()
const socketio = require('socket.io')
const helmet = require('helmet')

app.use(express.static(__dirname + '/public'))
app.use(helmet())

const expressServer = app.listen(8000)
const io = socketio(expressServer)

module.exports = {
    app, 
    io
}

// io.sockets.on('connect', (socket) => {
//     socket.on('disconnect', (socket) => {

//     })

//     socket.on('dataFromClients', (socket) => {

//     })

//     socket.emit('event', { }, () => {})

//     socket.on('', () => {})
// })