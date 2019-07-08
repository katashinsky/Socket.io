const express = require('express')
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'))

const namespaces = require('./data/namespaces')


const expresServer = app.listen(8000);
const io = socketio(expresServer);

io.of('/').on('connection', (socket) => {
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.image,
            endpoint: ns.endpoint
        }
    })

    socket.emit('nsList', nsData)
})

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
        
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallBack) => {
            nsSocket.join(roomToJoin)
            io.of('/wiki').in(roomToJoin).clients((error, clients) => {
                numberOfUsersCallBack(clients.length)
            })
        })
    })
})