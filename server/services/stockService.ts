import axios from 'axios'
import { StockData } from '../types/StockData'

const API_KEY = process.env.REALSTONKS_API_KEY
const API_URL = process.env.REALSTONKS_API_URL

const SYMBOLS = [
  'AAPL',
  'GOOGL',
  'MSFT',
  'AMZN',
  'TSLA',
  'NFLX',
  'NVDA',
  'PYPL',
  'INTC',
]

const fetchRealStockData = async (): Promise<StockData[]> => {
  if (!API_KEY || !API_URL) {
    throw new Error(
      'RealStonks API key or URL is not defined in environment variables. Please set REALSTONKS_API_KEY and REALSTONKS_API_URL.'
    )
  }

  try {
    console.log('Fetching stock data from RealStonks...')
    const promises = SYMBOLS.map(async (symbol) => {
      const response = await axios.get(`${API_URL}/stocks/${symbol}`, {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'realstonks.p.rapidapi.com',
        },
      })

      const data = response.data
      return {
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        timestamp: new Date().toISOString(),
      } as StockData
    })

    const results = await Promise.all(promises)
    return results
  } catch (error) {
    console.error('Error fetching stock data from RealStonks:', error)
    return []
  }
}

const fetchSimulatedStockData = async (): Promise<StockData[]> => {
  console.log('Fetching simulated stock data...')

  // Base prices for realistic simulation
  const basePrices: { [key: string]: number } = {
    AAPL: 175.5,
    GOOGL: 138.25,
    MSFT: 378.9,
    AMZN: 145.75,
    TSLA: 248.3,
    NFLX: 445.6,
    NVDA: 875.2,
    PYPL: 62.4,
    INTC: 25.8,
  }

  return SYMBOLS.map((symbol) => {
    const basePrice = basePrices[symbol] || 100
    // Generate realistic price fluctuation (-2% to +2%)
    const fluctuation = (Math.random() - 0.5) * 0.04
    const price = basePrice * (1 + fluctuation)

    return {
      symbol,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      timestamp: new Date().toISOString(),
    } as StockData
  })
}

export const fetchStockData = async (): Promise<StockData[]> => {
  if (process.env.USE_REAL_DATA === 'true') {
    return fetchRealStockData()
  } else {
    return fetchSimulatedStockData()
  }
}
