const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/prefData', { useNewUrlParser: true })
const Machine = require('./models/Machine')

function socketMain(io, socket) {
    console.log("A socket connected", socket.id)
    let macA;

    socket.on('clientAuth', (key) => {
        if (key === "sxd4z5xcd6jiuf89e789c9vsd") {
            // valid nodeClient
            socket.join('clients')
        } else if (key === "UIsc4s45ccsa4c6sa46") {
            // valid ui client has joined
            socket.join('ui')
        } else {
            // invalid client has join Goodbuy
            socket.disconnect(true)
        }
    })

    socket.on('initPerfData', (data) => {
        macA = data.macA
    })

    socket.on('perfData', (data) => {
        // console.log(JSON.stringify(data, null, 3))
    })
}

module.exports = socketMain