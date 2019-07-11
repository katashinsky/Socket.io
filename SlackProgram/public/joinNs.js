function joinNs(endpoint) {
    if (nsSocket) {
        console.log('remove socket')
        nsSocket.close()
        document.querySelector('#user-input').removeEventListener('submit', formSubmit)
    }

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
                joinRoom(e.target.innerText)
            })
        })
    })


    nsSocket.on('messageToClients', (msg) => {
        document.querySelector("#messages").innerHTML += buildHTML(msg)
    })

    document.querySelector('#user-input').addEventListener('submit', formSubmit)

}

function formSubmit(event) {
    event.preventDefault();
    console.log(nsSocket)
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', { text: newMessage })
    document.querySelector('#user-message').value = ''
}

function buildHTML(msg) {
    let time = new Date(msg.time).toLocaleString()
    const newHTML = `
        <li>
            <div class="user-image">
                <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username}<span> ${time}</span></div>
                <div class="message-text">${msg.text}</div>
            </div>
        </li>
    `

    return newHTML
}