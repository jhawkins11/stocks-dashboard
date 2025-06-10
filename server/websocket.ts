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

let stockDataInterval: NodeJS.Timeout | null = null

const fetchDataAndBroadcast = async () => {
  if (clients.length === 0) {
    console.log('No clients connected, stopping stock data fetching...')
    stopStockDataFetching()
    return
  }

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
}

const startStockDataFetching = () => {
  if (stockDataInterval) return

  console.log('Starting stock data fetching...')
  fetchDataAndBroadcast() // Run immediately
  stockDataInterval = setInterval(fetchDataAndBroadcast, 60000)
}

const stopStockDataFetching = () => {
  if (stockDataInterval) {
    console.log('Stopping stock data fetching...')
    clearInterval(stockDataInterval)
    stockDataInterval = null
  }
}

wss.on('connection', async (ws: WebSocket) => {
  clients.push(ws)
  console.log(`New client connected. Total clients: ${clients.length}`)

  // If we have no data, fetch it before sending initial data.
  if (Object.keys(stockHistories).length === 0) {
    console.log('No history. Fetching initial data...')
    const stockData = await fetchStockData()
    if (stockData.length > 0) {
      stockData.forEach((stock) => {
        stockHistories[stock.symbol] = [stock]
      })
    }
  }

  // Send the current history to the new client
  const historyData: StockData[][] = Object.values(stockHistories)
  broadcastInitialStockData(historyData, ws)

  // Start the update interval if it's the first client and it's not running
  if (clients.length === 1 && !stockDataInterval) {
    startStockDataFetching()
  }

  ws.on('close', () => {
    console.log('Client disconnected')
    clients.splice(clients.indexOf(ws), 1)

    // Stop fetching stock data if no clients remain
    if (clients.length === 0) {
      stopStockDataFetching()
    }
  })
})

export { wss }
