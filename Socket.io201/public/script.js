
const socket = io('http://localhost:8000')
const socket2 = io('http://localhost:8000/admin')

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

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const newMessage = document.querySelector('#user-message').value
    socket.emit('newMessageToServer', { data: newMessage })
})


