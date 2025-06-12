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
  stockDataInterval = setInterval(fetchDataAndBroadcast, 8000)
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
    // For demo purposes, create initial history with multiple data points
    // This simulates the market having been running for a while
    const initialHistorySize = 5

    for (let i = initialHistorySize - 1; i >= 0; i--) {
      const stockData = await fetchStockData()
      if (stockData.length > 0) {
        // Adjust timestamps to simulate historical data
        const historicalTimestamp = new Date(
          Date.now() - i * 8000
        ).toISOString()

        stockData.forEach((stock) => {
          const historicalStock = {
            ...stock,
            timestamp: historicalTimestamp,
          }

          if (!stockHistories[stock.symbol]) {
            stockHistories[stock.symbol] = []
          }
          stockHistories[stock.symbol].push(historicalStock)
        })
      }

      // Small delay between historical data points to simulate realistic price evolution
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
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
