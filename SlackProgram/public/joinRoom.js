function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        document.querySelector('.curr-room-num-users').innerHTML = `Users  ${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    })
}