const os = require('os')
const io = require('socket.io-client')
let socket = io('http://127.0.0.1:8000')

socket.on('connect', () => {
    console.log('I connected to the socket server... horay')
    const nI = os.networkInterfaces()
    let macA;

    for(let key in nI){
        if(!nI[key][0].internal){
            macA = nI[key][0].mac
            break
        }
    }

    socket.emit('clientAuth', 'sxd4z5xcd6jiuf89e789c9vsd')

    performanceData().then((allData) => {
        allData.macA = macA
        socket.emit('initPerfData', allData)
    })

    let perfDataInterval = setInterval(() => {
        performanceData().then((allData) => {
            socket.emit('perfData', allData)
        })
    }, 1000)

    socket.on('disconnect', () => {
        clearInterval(perfDataInterval)
    })
})

function performanceData() {
    return new Promise(async (resolve, reject) => {
        const cpus = os.cpus();
        // What do we need to know from node about performance?
        // - CPU load (current)
        // - Memory Useage
        //  - free
        const freeMem = os.freemem();
        //  - total
        const totalMem = os.totalmem();
        const usedMem = totalMem - freeMem;
        const memUseage = Math.floor(usedMem / totalMem * 100) / 100;
        // - OS type
        const osType = os.type() == 'Darwin' ? 'Mac' : os.type();
        // - uptime
        const upTime = os.uptime();
        // - CPU info
        //  - Type
        const cpuModel = cpus[0].model
        //  - Number of Cores
        const numCores = cpus.length;
        //  - Clock Speed
        const cpuSpeed = cpus[0].speed
        const cpuLoad = await getCpuLoad();
        const isActive = true;
        resolve({ freeMem, totalMem, usedMem, memUseage, osType, upTime, cpuModel, numCores, cpuSpeed, cpuLoad, isActive })
    })
}

function cpuAverage() {
    const cpus = os.cpus();
    // get ms in each mode, BUT this number is since reboot
    // so get it now, and get it in 100ms and compare
    let idleMs = 0;
    let totalMs = 0;
    // loop through each core
    cpus.forEach((aCore) => {
        // loop through each property of the current core
        for (type in aCore.times) {
            totalMs += aCore.times[type];
        }
        idleMs += aCore.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

function getCpuLoad() {
    return new Promise((resolve, reject) => {
        const start = cpuAverage()
        setTimeout(() => {
            const end = cpuAverage()
            const idleDifference = end.idle - start.idle
            const totalDifference = end.total - start.total

            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
            resolve(percentageCpu)
        }, 1000)
    })
}
