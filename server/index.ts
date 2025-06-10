import app from './app'
import { wss } from './websocket'

const port = process.env.PORT || 5000

const server = app.listen(port, function () {
  console.log(`Listening on port ${port}.`)
})

// Upgrade the incoming HTTP request to a WebSocket connection
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

export default app
