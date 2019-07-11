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
        nsSocket.emit('nsRoomLoad', namespace.rooms)

        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallBack) => {
            let roomToLeave = Object.keys(nsSocket.rooms)[1]
            nsSocket.leave(roomToLeave)
            updateUsersInRoom(namespace, roomToLeave)

            nsSocket.join(roomToJoin)
            
            // io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
            //     numberOfUsersCallBack(clients.length)
            // })

            io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
                io.of(namespace.endpoint).in(roomToJoin).emit('updateUserCount', clients.length)
            })

            let nsRoom = namespace.rooms.find(elem => elem.roomTitle === roomToJoin)
            nsSocket.emit('historyCatchUp', nsRoom.history)
            updateUsersInRoom(namespace, roomToJoin)
        })

        

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMessage = {
                text: msg.text,
                time: Date.now(),
                username: nsSocket.handshake.query.username,
                avatar: "https://via.placeholder.com/30"
            }
            let roomTitle = Object.keys(nsSocket.rooms)[1]


            let nsRoom = namespace.rooms.find(elem => elem.roomTitle === roomTitle)
            nsRoom.addMessage(fullMessage)
            console.log(nsRoom)

            io.of(namespace.endpoint).in(roomTitle).emit('messageToClients', fullMessage)
        })
    })
})

function updateUsersInRoom(namespace, roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateUserCount', clients.length)
    })
}