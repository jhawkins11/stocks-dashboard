import axios from 'axios'
import { StockData } from '../types/StockData'

const API_KEY = process.env.REALSTONKS_API_KEY
const API_URL = process.env.REALSTONKS_API_URL

if (!API_KEY || !API_URL) {
  throw new Error(
    'RealStonks API key or URL is not defined in environment variables.'
  )
}

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

export const fetchStockData = async (): Promise<StockData[]> => {
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
        // no timestamp in response, using current time
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
