
const socket = io('http://localhost:8000')
const socket2 = io('http://localhost:8000/admin')
const socket3 = io('http://localhost:8000/group')


socket.on('connect', () => {
    console.log("first", socket.id)
})

socket2.on('connect', () => {
    console.log("second", socket2.id)
})

socket2.on('messageToAdmin', (data) => {
    console.log(data)
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

socket.on('messageForClients', (data) => {
    const messagesList = document.querySelector('#messages')
    messagesList.innerHTML += data.text + '<br>'
})

