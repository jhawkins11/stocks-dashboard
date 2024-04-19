import WebSocket from 'ws'

interface StockData {
  symbol: string
  price: number
  timestamp: string
}

const wss = new WebSocket.Server({ port: 8080 })
const clients: WebSocket[] = []

wss.on('connection', (ws: WebSocket) => {
  clients.push(ws)
  console.log('New client connected')

  ws.on('close', () => {
    console.log('Client disconnected')
    clients.splice(clients.indexOf(ws), 1)
  })
})

const broadcastStockData = (stockData: StockData[]) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(stockData))
    }
  })
}

export { broadcastStockData }
