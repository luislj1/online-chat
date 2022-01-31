const express = require('express')
const cors = require('cors')
const http = require('http')
const app = express()
const { v4 } = require('uuid');

app.use(cors())

const server = http.createServer(app)

const socket = require('socket.io')
const io = socket(server, {
  cors: {
    origin: "*"
  }
})

io.on('connection', (client) => {

  client.on('message', data => {
    io.emit('message', {user: data.user, message: data.message, id: v4()})
  })

})

server.listen(3005, () => console.log("Server running!"))

