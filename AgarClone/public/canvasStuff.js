function init() {
    draw()
}

// ======================================
// ================DRAWING===============
// ======================================
player.locX = Math.floor(500 * Math.random() + 10)
player.locY = Math.floor(500 * Math.random() + 10)
function draw() {
    context.clear(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.fillStyle = "rgb(255,30,230)"

    context.arc(player.locX, player.locY, 10, 0, Math.PI * 2)
    context.fill()
    context.lineWidth = 3
    context.strokeStyle = "rgb(0,255,0)"
    context.stroke()
    requestAnimationFrame(draw)
}

canvas.addEventListener('mousemove', (event) => {
    // console.log(event)
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / Math.PI;
    if (angleDeg >= 0 && angleDeg < 90) {
        // console.log("Mouse is in the lower right quad")
        xVector = 1 - (angleDeg / 90);
        yVector = -(angleDeg / 90);
    } else if (angleDeg >= 90 && angleDeg <= 180) {
        // console.log("Mouse is in the lower left quad")
        xVector = -(angleDeg - 90) / 90;
        yVector = -(1 - ((angleDeg - 90) / 90));
    } else if (angleDeg >= -180 && angleDeg < -90) {
        // console.log("Mouse is in the upper left quad")
        xVector = (angleDeg + 90) / 90;
        yVector = (1 + ((angleDeg + 90) / 90));
    } else if (angleDeg < 0 && angleDeg >= -90) {
        // console.log("Mouse is in the upper right quad")
        xVector = (angleDeg + 90) / 90;
        yVector = (1 - ((angleDeg + 90) / 90));
    }

    player.xVector = xVector;
    player.yVector = yVector;


})