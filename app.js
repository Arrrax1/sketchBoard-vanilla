// Set CANVAS SIZE
let canvas = document.querySelector('canvas')
canvas.height = document.querySelector('.board').clientHeight
canvas.width = document.querySelector('.canvas-container').clientWidth

let ctx = canvas.getContext('2d')

// GET Canvas boundings to know mouse position
//   inside canvas eg:(event.ClientX - canvas_left) (relative position)
let canvas_top = canvas.offsetTop
let canvas_left = canvas.offsetLeft

// Init
let tool
let color
ctx.lineWidth = '2'
ctx.lineCap = 'round'


// loop to add the onChange Event to get newly selected Tool
document.querySelectorAll('.tool').forEach(el => {
    // onChange Trigger will update the current tool
    el.addEventListener('change', () => {
        // update the current tool
        tool = el.id
        console.log(tool)
    })
})
document.querySelector('#color').addEventListener('change', event => {
    ctx.strokeStyle = event.target.value
    ctx.fillStyle = event.target.value
})

// Select Line Width and line Cap
document.querySelectorAll('.line-width').forEach(lineWinput => {
    lineWinput.addEventListener('change', newWidthinput => {
        if (newWidthinput.target.checked) {
            let inputID = newWidthinput.target.id
            switch (inputID) {
                case 's':
                    ctx.lineWidth = '2'
                    break;

                case 'm':
                    ctx.lineWidth = '5'
                    break;

                case 'l':
                    ctx.lineWidth = '10'
                    break;

                case 'xl':
                    ctx.lineWidth = '15'
                    break;

                default:
                    break;
            }
        }
    })
})
document.querySelectorAll('.line-cap').forEach(lineCinput => {
    lineCinput.addEventListener('change', event => {
        if (event.target.checked) {
            let inputID = event.target.id
            switch (inputID) {
                case 'square':
                    ctx.lineCap = 'square'
                    break;

                case 'round':
                    ctx.lineCap = 'round'
                    break;

                default:
                    break;
            }
        }
    })
})



let starting_X, ending_X, starting_Y, ending_Y
let isDrawing = false
let prevColor = 'black' // to set back strokeStyle to previous color after eraser use
let prevWidth = '2' // to set back strokeWidth to previous width after eraser use

document.querySelector('canvas').addEventListener('mousedown', (event) => {
    isDrawing = true
    starting_X = event.clientX - canvas_left
    starting_Y = event.clientY - canvas_top
    prevColor = ctx.strokeStyle
    prevWidth = ctx.lineWidth
    ctx.globalCompositeOperation = "source-over";
    if (tool=='erase') {
        ctx.lineWidth=ctx.lineWidth*2
    }

})

document.querySelector('canvas').addEventListener('mouseup', (event) => {
    isDrawing = false
    ending_X = event.clientX - canvas_left
    ending_Y = event.clientY - canvas_top
})

document.querySelector('canvas').addEventListener('mousemove', (event) => {
    if (tool == 'pen') {
        if (isDrawing) {

            starting_X = event.clientX - canvas_left
            starting_Y = event.clientY - canvas_top

            // ctx.strokeStyle = 'rgba(0,0,0,0.1)' // this makes a paint brush style

            ctx.lineTo(starting_X, starting_Y)
            ctx.stroke()
        }
    }
    if (tool == 'erase') {
        ctx.globalCompositeOperation = 'destination-out'
        if (isDrawing) {

            starting_X = event.clientX - canvas_left
            starting_Y = event.clientY - canvas_top

            ctx.lineTo(starting_X, starting_Y)

            ctx.stroke()
        }
    }
})

document.querySelector('canvas').addEventListener('mouseup', (event) => {
    switch (tool) {
        case 'pen':
            ctx.beginPath()
            break;

        case 'line':
            ctx.beginPath()
            ctx.moveTo(starting_X, starting_Y)
            ctx.lineTo(ending_X, ending_Y)
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            break;

        case 'elipse':
            ctx.beginPath()
            ctx.arc(starting_X, starting_Y, Math.abs((ending_X - starting_X + ending_Y - starting_Y)) - 1, 0, Math.PI * 2, false)
            // you can make a circle using roundRect if width==height
            // ctx.roundRect(starting_X, starting_Y, Math.abs((ending_X-starting_X+ending_Y-starting_Y))-1,Math.abs((ending_X-starting_X+ending_Y-starting_Y))-1, Math.PI*360) 
            // ctx.fillStyle = '#fff'
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            break;

        case 'rect':
            ctx.beginPath()
            ctx.fillRect(starting_X, starting_Y, ending_X - starting_X, ending_Y - starting_Y)
            // Rect with rounded corners (border Radius)
            // ctx.roundRect(starting_X, starting_Y,ending_X-starting_X, ending_Y-starting_Y,Math.PI*360)
            // ctx.stroke()
            // ctx.strokeStyle='red'  // don't forget to add another color picker for stroke
            // ctx.strokeRect(starting_X, starting_Y,ending_X-starting_X, ending_Y-starting_Y)
            ctx.closePath()
            ctx.beginPath()
            break;

        case 'erase':
            // ctx.clearRect(0,0,canvas.width,canvas.height)
            // ctx.beginPath()
            // ctx.strokeStyle = prevColor
            ctx.lineWidth = prevWidth

            ctx.beginPath()
            break;

        default:
            break;
    }
})