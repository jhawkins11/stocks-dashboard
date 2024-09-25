import request from 'supertest'
import app from '..'
import db from '../db'

describe('Watchlist routes', () => {
  // delete all test records from the watchlists table before each test
  beforeEach(async () => {
    if (!db) {
      throw new Error('Database not initialized')
    }
    await db.query('DELETE FROM watchlists WHERE token = "testtoken"')
  })
  afterAll(async () => {
    if (!db) {
      throw new Error('Database not initialized')
    }
    await db.end()
  })

  describe('POST /watchlist', () => {
    it('should add a stock to the watchlist', async () => {
      const response = await request(app)
        .post('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })
      expect(response.status).toBe(200)
      expect(response.text).toBe('Added to watchlist')
    })

    it('should handle database errors', async () => {
      if (!db) {
        throw new Error('Database not initialized')
      }
      // Mock the db.query function to throw an error
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .post('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })
      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })

  describe('GET /watchlist', () => {
    it('should retrieve the watchlist for a given token', async () => {
      if (!db) {
        throw new Error('Database not initialized')
      }
      // Add a stock to the watchlist before the test
      await db.query(
        `INSERT INTO watchlists (stock_symbol, token) VALUES ('AAPL', 'testtoken')`
      )

      const response = await request(app)
        .get('/watchlist')
        .query({ token: 'testtoken' })
      expect(response.status).toBe(200)
      expect(response.body).toEqual([{ stock_symbol: 'AAPL' }])
    })

    it('should handle database errors', async () => {
      if (!db) {
        throw new Error('Database not initialized')
      }
      // Mock the db.query function to throw an error
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .get('/watchlist')
        .query({ token: 'testtoken' })
      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })

  describe('DELETE /watchlist', () => {
    it('should delete a stock from the watchlist', async () => {
      if (!db) {
        throw new Error('Database not initialized')
      }
      // Add a stock to the watchlist before the test
      await db.query(
        `INSERT INTO watchlists (stock_symbol, token) VALUES ('AAPL', 'testtoken')`
      )

      const response = await request(app)
        .delete('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })
      expect(response.status).toBe(200)
      expect(response.text).toBe('Deleted from watchlist')
    })

    it('should handle database errors', async () => {
      if (!db) {
        throw new Error('Database not initialized')
      }
      // Mock the db.query function to throw an error
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .delete('/watchlist')
        .send({ symbol: 'AAPL', token: 'testtoken' })
      expect(response.status).toBe(500)
      expect(response.text).toBe('Database error')
    })
  })
})
