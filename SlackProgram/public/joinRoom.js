function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `Users  ${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    })


    nsSocket.on('historyCatchUp', (history) => {
        let messages = document.querySelector("#messages")
        messages.innerHTML = ""
        history.forEach(msg => {
            const newMessage = buildHTML(msg);
            const currentMessage = messages.innerHTML
            messages.innerHTML = currentMessage + newMessage
            messages.scrollTo(0, messages.scrollHeight)
        })

    })

    nsSocket.on('updateUserCount', (userCount) => {
        document.querySelector('.curr-room-num-users').innerHTML = `Users  ${userCount} <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = roomName
    })

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) => {
        let messages = Array.from(document.getElementsByClassName('message-text'))
        console.log(e.target.value)
        messages.forEach(msg => {
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                msg.parentNode.parentNode.style.display = "none"
            }else{
                msg.parentNode.parentNode.style.display = "block"
            }
        })
    })
}