const express = require('express')
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'))

const namespaces = require('./data/namespaces')


const expresServer = app.listen(8000);
const io = socketio(expresServer);

io.of('/').on('connection', (socket) => {
    socket.emit('messageFromServer', { data: "Data from server" })

    socket.on('messageToServer', (data) => {
        console.log(data)
    })

    socket.join('level1')
    socket.to("level1").emit('joined', `${socket.id} says I have joined in this level1 room`)
})

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (socket) => {
        console.log(`${socket.id} has joined ${namespace.endpoint}`)
    })
})