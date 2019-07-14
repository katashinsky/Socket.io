let socket = io.connect('http://localhost:8000')

socket.on('initReturn', (data) => {
    orbs = data.orbs

    setInterval(() => {
        socket.emit('tick', {
            xVector: player.xVector,
            yVector: player.yVector
        })
    }, 33)
})

socket.on('tock', (data) => {
    players = data.players
})

socket.on('tickTock', (data) => {
    player.playerX = data.playerX
    player.playerY = data.playerY
    player.radius = data.radius
})

socket.on('orbSwitch', (data) => {
    orbs.splice(data.orbIndex, 1, data.newOrb)
})

socket.on('updateLeaderData', (data) => {
    document.querySelector('.leader-board').innerHTML = ""
    data.forEach((player) => {
        document.querySelector('.leader-board').innerHTML += `<li class="leaderboard-player">${player.name} - ${player.score}</li>`
    })
})

socket.on('playerDeath', (data) => {
    document.querySelector('#game-message').innerHTML = `${data.died.name} absorbe by ${data.killedBy.name}`
    $('#game-message').css({'background-color': '#00e6e6'})
    $('#game-message').show()
    $('#game-message').fadeOut(5000)

})
// this function is call when the user clicks in the start button

function init() {
    draw()
    socket.emit('init', {
        playerName: player.name
    })
}
