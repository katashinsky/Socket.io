const io = require('../servers').io
const { checkForOrbCollisions, checkForPlayerCollisions } = require('./checkCollision')

const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')

let orbs = []
let players = []
let settings = {
    defaultOrbs: 50,
    defaultSpeed: 5,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500,
}

initGame()

setInterval(() => {
    if (players.length > 0) {
        io.to('game').emit('tock', {
            players,
        })
    }
}, 33);


io.sockets.on('connect', (socket) => {
    let player = {}

    socket.on('init', (data) => {
        socket.join('game')
        let playerData = new PlayerData(data.playerName, settings)
        let playerConfig = new PlayerConfig(settings)
        player = new Player(socket.id, playerConfig, playerData)

        setInterval(() => {
            socket.emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY,
                radius: player.playerData.radius
            })
        }, 33);

        socket.emit('initReturn', { orbs })
        players.push(playerData)
    })

    // send data to all conected users
    socket.on('tick', (data) => {
        speed = player.playerConfig.speed
        // update the playerConfig object with the new direction in data
        // and at the same time create a local variable for this callback for readability
        xV = player.playerConfig.xVector = data.xVector;
        yV = player.playerConfig.yVector = data.yVector;

        if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)) {
            player.playerData.locY -= speed * yV;
        } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)) {
            player.playerData.locX += speed * xV;
        } else {
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        let cuptureOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
        cuptureOrb
            .then(data => {
                // if collisions happend
                const orbData = {
                    orbIndex: data,
                    newOrb: orbs[data]
                }
                io.sockets.emit('updateLeaderData', getLeaderBoard())
                io.sockets.emit('orbSwitch', orbData)
            })
            .catch((error) => {
                // no collisions happend
            })

        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
        playerDeath
            .then((data) => {
                io.sockets.emit('updateLeaderData', getLeaderBoard())
                io.sockets.emit('playerDeath', data)
            })
            .catch((error) => {

            })
    })

    socket.on('disconnect', (data) => {
        // console.log(data) 
        if (player.playerData) {
            players.forEach((currPlayer, index) => {
                if (currPlayer.uid == player.playerData.uid) {
                    players.splice(index, 1)
                    io.sockets.emit('updateLeaderData', getLeaderBoard())
                }
            })

            const updateStats = `
                UPDATE stats
                    SET highScore = CASE WHEN highScore < ? THEN ? ELSE highScore END,
                    mostOrbs = CASE WHEN mostOrbs < ? THEN ? ELSE mostOrbs END,
                    mostPlayers = CASE WHEN mostPlayers < ? THEN ? ELSE mostPlayers END
                WHERE username = ?
             `
        }
    })
})

function getLeaderBoard() {
    // sort players in desc order
    players.sort((a, b) => {
        return b.score - a.score
    })

    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })

    return leaderBoard
}

function initGame() {
    for (let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}

module.exports = io