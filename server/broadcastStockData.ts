import WebSocket from 'ws'

interface StockData {
  symbol: string
  price: number
  timestamp: string
}

interface SocketMessage {
  type: 'initial' | 'update'
  data: StockData[] | StockData[][]
}

const broadcastStockData = (stockData: StockData[], clients: WebSocket[]) => {
  const message: SocketMessage = {
    type: 'update',
    data: stockData,
  }
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

const broadcastInitialStockData = (
  stockData: StockData[][],
  client: WebSocket
) => {
  const message: SocketMessage = {
    type: 'initial',
    data: stockData,
  }
  client.send(JSON.stringify(message))
}

export { broadcastStockData, broadcastInitialStockData }
