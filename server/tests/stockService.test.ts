import axios from 'axios'

// Mock axios for testing
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Stock Service', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeAll(() => {
    originalEnv = process.env
  })

  beforeEach(() => {
    jest.resetAllMocks()
    // Clear environment variables for each test
    process.env = {}
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('Environment Variable Logic', () => {
    it('should use simulated data when USE_REAL_DATA is not set', async () => {
      // Import after clearing env vars
      const { fetchStockData } = await import('../services/stockService')

      const stockData = await fetchStockData()

      expect(stockData).toHaveLength(9)
      expect(stockData[0]).toHaveProperty('symbol')
      expect(stockData[0]).toHaveProperty('price')
      expect(stockData[0]).toHaveProperty('timestamp')

      // Verify all expected symbols are present
      const symbols = stockData.map((stock) => stock.symbol)
      expect(symbols).toEqual([
        'AAPL',
        'GOOGL',
        'MSFT',
        'AMZN',
        'TSLA',
        'NFLX',
        'NVDA',
        'PYPL',
        'INTC',
      ])

      // Verify prices are realistic numbers
      stockData.forEach((stock) => {
        expect(typeof stock.price).toBe('number')
        expect(stock.price).toBeGreaterThan(0)
        expect(stock.price).toBeLessThan(2000)
      })

      // Verify timestamps are valid ISO strings
      stockData.forEach((stock) => {
        expect(new Date(stock.timestamp).toISOString()).toBe(stock.timestamp)
      })
    })

    it('should use simulated data when USE_REAL_DATA is false', async () => {
      process.env.USE_REAL_DATA = 'false'

      // Re-import to pick up new env vars
      jest.resetModules()
      const { fetchStockData } = await import('../services/stockService')

      const stockData = await fetchStockData()

      expect(stockData).toHaveLength(9)
      expect(stockData[0].symbol).toBe('AAPL')
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    it('should attempt to use real data when USE_REAL_DATA is true but throw error when API keys missing', async () => {
      process.env.USE_REAL_DATA = 'true'
      // Don't set API keys

      jest.resetModules()
      const { fetchStockData } = await import('../services/stockService')

      await expect(fetchStockData()).rejects.toThrow(
        'RealStonks API key or URL is not defined in environment variables'
      )
    })

    it('should return empty array when real API calls fail', async () => {
      process.env.USE_REAL_DATA = 'true'
      process.env.REALSTONKS_API_KEY = 'test-key'
      process.env.REALSTONKS_API_URL = 'https://test-api.com'

      mockedAxios.get.mockRejectedValue(new Error('API Error'))

      jest.resetModules()
      const { fetchStockData } = await import('../services/stockService')

      const stockData = await fetchStockData()

      expect(stockData).toEqual([])
    })
  })

  describe('Simulated Data Quality', () => {
    it('should generate different prices on subsequent calls', async () => {
      process.env.USE_REAL_DATA = undefined

      jest.resetModules()
      const { fetchStockData } = await import('../services/stockService')

      const firstCall = await fetchStockData()
      const secondCall = await fetchStockData()

      // Prices should be different due to random fluctuation
      const firstPrices = firstCall.map((stock) => stock.price)
      const secondPrices = secondCall.map((stock) => stock.price)

      // At least some prices should be different
      const hasDifferentPrices = firstPrices.some(
        (price, index) => price !== secondPrices[index]
      )
      expect(hasDifferentPrices).toBe(true)
    })

    it('should generate realistic price ranges for simulated data', async () => {
      jest.resetModules()
      const { fetchStockData } = await import('../services/stockService')

      const stockData = await fetchStockData()

      // Check that prices are within reasonable ranges for each stock
      const priceMap = stockData.reduce((acc, stock) => {
        acc[stock.symbol] = stock.price
        return acc
      }, {} as { [key: string]: number })

      // AAPL should be around 175.50 +/- 2%
      expect(priceMap['AAPL']).toBeGreaterThan(172)
      expect(priceMap['AAPL']).toBeLessThan(179)

      // NVDA should be around 875.20 +/- 2%
      expect(priceMap['NVDA']).toBeGreaterThan(857)
      expect(priceMap['NVDA']).toBeLessThan(893)
    })
  })
})
