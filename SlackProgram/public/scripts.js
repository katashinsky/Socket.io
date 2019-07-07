
const socket = io('http://localhost:8000')
const socket2 = io('http://localhost:8000/wiki')
const socket3 = io('http://localhost:8000/mozilla')
const socket4 = io('http://localhost:8000/linux')

socket2.on('welcome', (dataFromServer) => {
    console.log(dataFromServer)
})

socket.on('joined', (msg) => {
    console.log(msg)
})

socket.on('messageFromServer', (data) => {
    console.log(data)
    socket.emit("messageToServer", { data: "Data from the client" });
})


