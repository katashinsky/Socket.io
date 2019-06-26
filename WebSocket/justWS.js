const http = require('http')
const webSoket = require('ws')


const server = http.createServer((req, res) => {
    res.end('I am connected')
})

const wss = new webSoket.Server({server})

wss.on('headers', (headers, msg) => {
    console.log(headers)
})

wss.on('connection', (ws, req) => {
    ws.send("Welcom to web socket server")
    ws.on('message', (msg) => {
        console.log(msg)
    })
})

server.listen(8000) 