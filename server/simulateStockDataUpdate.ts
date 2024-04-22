import { StockData } from './types/StockData'
let history: StockData[][] = []
const simulateStockDataUpdate = (): {
  stockData: StockData[]
  history: StockData[][]
} => {
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
    {
      symbol: 'NFLX',
      price: 500.0 + Math.random() * 10,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'FB',
      price: 350.0 + Math.random() * 10,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'NVDA',
      price: 200.0 + Math.random() * 10,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'PYPL',
      price: 250.0 + Math.random() * 10,
      timestamp: new Date().toISOString(),
    },
    {
      symbol: 'INTC',
      price: 55.0 + Math.random() * 5,
      timestamp: new Date().toISOString(),
    },
  ]
  history.push(stockData)
  // Return the last 10 updates
  if (history.length > 10) {
    history = history.slice(history.length - 10)
  }
  return { stockData, history }
}

export { simulateStockDataUpdate }
