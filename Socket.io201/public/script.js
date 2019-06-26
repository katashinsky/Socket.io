const socket = io('http://localhost:8000')
const socket2 = io('http://localhost:8000/admin')

const messagesList = document.querySelector('#messages')

socket.on('connect', () => {
    console.log(socket.id)
})

socket2.on('connect', () => {
    console.log(socket2.id)
})

socket2.on('Welcome', (data) => {
    // messagesList.innerHTML += `<li>${data.text}</li>`
    console.log(data)
})

socket.on('messageFromServer', (data) => {
    console.log(data)
    socket.emit("messageToServer", { data: "Data from the client" });
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const newMessage = document.querySelector('#user-message').value
    console.log(newMessage)
    socket.emit('newMessageToServer', { data: newMessage })
    // socket2.of('/admin').emit('newMessageToServer', { data: newMessage })
})

socket.on('messageForClients', (data) => {
    messagesList.innerHTML += `<li>${data.text}</li>`


})
