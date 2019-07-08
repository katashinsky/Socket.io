function joinNs(endpoint) {
    nsSocket = io(`http://localhost:8000${endpoint}`)
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list')
        let glyph;
        roomList.innerHTML = ""
        nsRooms.forEach(room => {
            if (room.privateRoom) glyph = 'lock'
            else glyph = "globe"

            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
        })

        document.querySelectorAll('.room').forEach((elem) => {
            elem.addEventListener('click', e => {
                console.log("Someone click on ", e.target.innerHTML)
            })
        })

        let topRoom = document.querySelector('.room')
        let topRoomName = topRoom.innerText
        joinRoom(topRoomName)
    })

    
    socket.on('messageToClients', (msg) => {
        console.log(msg)
        document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`
    })

    document.querySelector('.message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').nodeValue;
        socket.emit('newMessageToServer', { text: newMessage })
    })

}