import WebSocket from 'ws'
import {
  broadcastInitialStockData,
  broadcastStockData,
} from './broadcastStockData'
import { fetchStockData } from './services/stockService'
import { StockData } from './types/StockData'

// Define the maximum number of history points
const MAX_HISTORY = 5

// In-memory store for stock histories
const stockHistories: { [symbol: string]: StockData[] } = {}

const wss = new WebSocket.Server({ noServer: true })
const clients: WebSocket[] = []

wss.on('connection', async (ws: WebSocket) => {
  clients.push(ws)
  console.log('New client connected')

  if (Object.keys(stockHistories).length === 0) {
    const stockData = await fetchStockData()
    stockData.forEach((stock) => {
      if (!stockHistories[stock.symbol]) {
        stockHistories[stock.symbol] = []
      }
      stockHistories[stock.symbol].push(stock)
    })
  }

  // Prepare history data to send
  const historyData: StockData[][] = Object.values(stockHistories)

  broadcastInitialStockData(historyData, ws)

  ws.on('close', () => {
    console.log('Client disconnected')
    clients.splice(clients.indexOf(ws), 1)
  })
})

// Broadcast stock data updates to all connected clients every 60 seconds
setInterval(async () => {
  const stockData = await fetchStockData()
  if (stockData.length > 0) {
    // Update histories
    stockData.forEach((stock) => {
      if (!stockHistories[stock.symbol]) {
        stockHistories[stock.symbol] = []
      }
      stockHistories[stock.symbol].push(stock)
      if (stockHistories[stock.symbol].length > MAX_HISTORY) {
        stockHistories[stock.symbol].shift()
      }
    })

    broadcastStockData(stockData, clients)
  }
}, 60000) // Fetch every 60 seconds

export { wss }
