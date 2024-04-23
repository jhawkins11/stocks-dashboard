import WebSocket from 'ws'
import {
  broadcastInitialStockData,
  broadcastStockData,
} from './broadcastStockData'
import { simulateStockDataUpdate } from './simulateStockDataUpdate'

const wss = new WebSocket.Server({ noServer: true })
const clients: WebSocket[] = []

wss.on('connection', (ws: WebSocket) => {
  clients.push(ws)
  console.log('New client connected')
  const { history } = simulateStockDataUpdate()
  // Send the initial stock data to the client
  broadcastInitialStockData(history, ws)

  ws.on('close', () => {
    console.log('Client disconnected')
    clients.splice(clients.indexOf(ws), 1)
  })
})

// Broadcast stock data updates to all connected clients every 5 seconds
setInterval(() => {
  const { stockData } = simulateStockDataUpdate()
  broadcastStockData(stockData, clients)
}, 5000)

export { wss }
