import request from 'supertest'
import app from '../app'

jest.mock('../db', () => ({
  query: jest.fn(),
  end: jest.fn(),
}))

import db from '../db'
const mockDb = db as jest.Mocked<NonNullable<typeof db>>

describe('Watchlist routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /watchlist', () => {
    it('should add a stock to the watchlist', async () => {
      // Mock successful database query
      mockDb.query.mockResolvedValueOnce([{ affectedRows: 1 }, []] as any)

      const response = await request(app)
        .post('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })

      expect(response.status).toBe(200)
      expect(response.text).toBe('Added to watchlist')
      expect(mockDb.query).toHaveBeenCalledWith(
        "INSERT INTO watchlists (stock_symbol, token) VALUES ('AAPL', 'testtoken')"
      )
    })

    it('should handle database errors', async () => {
      // Mock database error
      mockDb.query.mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .post('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })

      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })

  describe('GET /watchlist', () => {
    it('should retrieve the watchlist for a given token', async () => {
      // Mock database query to return watchlist data
      const mockResult = [[{ stock_symbol: 'AAPL' }], []]
      mockDb.query.mockResolvedValueOnce(mockResult as any)

      const response = await request(app)
        .get('/watchlist')
        .query({ token: 'testtoken' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual([{ stock_symbol: 'AAPL' }])
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT stock_symbol FROM watchlists WHERE token = 'testtoken'"
      )
    })

    it('should handle database errors', async () => {
      // Mock database error
      mockDb.query.mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .get('/watchlist')
        .query({ token: 'testtoken' })

      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })

  describe('DELETE /watchlist', () => {
    it('should delete a stock from the watchlist', async () => {
      // Mock successful database delete
      mockDb.query.mockResolvedValueOnce([{ affectedRows: 1 }, []] as any)

      const response = await request(app)
        .delete('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })

      expect(response.status).toBe(200)
      expect(response.text).toBe('Deleted from watchlist')
      expect(mockDb.query).toHaveBeenCalledWith(
        "DELETE FROM watchlists WHERE stock_symbol = 'AAPL' AND token = 'testtoken'"
      )
    })

    it('should handle database errors', async () => {
      // Mock database error
      mockDb.query.mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .delete('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })

      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })
})
