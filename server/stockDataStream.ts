import { broadcastStockData } from './websocket'

interface StockData {
  symbol: string
  price: number
  timestamp: string
}

const simulateStockDataUpdate = () => {
  // Generate random stock data
  const stockData: StockData[] = [
    {
      symbol: 'AAPL',
      price: 145.0 + Math.random() * 10,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'GOOGL',
      price: 2430.0 + Math.random() * 20,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'MSFT',
      price: 277.0 + Math.random() * 5,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'AMZN',
      price: 3550.0 + Math.random() * 30,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'TSLA',
      price: 700.0 + Math.random() * 50,
      timestamp: new Date().toISOString(),
    },
  ]

  // Broadcast the stock data to all connected clients
  broadcastStockData(stockData)
}

// Start simulating stock data updates every 5 seconds
setInterval(simulateStockDataUpdate, 5000)
