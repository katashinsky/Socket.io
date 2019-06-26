const express = require('express')
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'))

const expresServer = app.listen(8000);

const io = socketio(expresServer);

io.on('connection', (socket) => {
    socket.emit('messageFromServer', { data: "Data from server" })

    socket.on('messageToServer', (data) => {
        console.log(data)
    })

    socket.on('newMessageToServer', (msg) => {
        io.emit('messageForClients', { text: msg.data })
    })
})