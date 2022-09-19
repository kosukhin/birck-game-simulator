const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: '*',
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
})

server.listen(3512)

let gridState = []

io.on('connection', (socket) => {
    socket.on('sendMessage', (args) => {
        if (args.grid) {
            gridState = args.grid
        }

        io.emit('receiveMessage', {
            grid: gridState,
        })
    })
})
