function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `Users  ${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    })


    nsSocket.on('historyCatchUp', (history) => {
        let messages = document.querySelector("#messages")
        messages.innerHTML = ''
        history.forEach(msg => {
            const newMessage = buildHTML(msg);
            const currentMessage = messages.innerHTML
            messages.innerHTML += currentMessage + newMessage
        })
    })
}