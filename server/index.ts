import express from 'express'
import bodyParser from 'body-parser'
import db from './db'
import cors from 'cors'
require('dotenv').config()
// Start the WebSocket server
import('./websocket')

// Start simulating stock data updates
import('./simulateStockDataUpdate')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('<h1>Stock Dashboard API</h1>')
})

app.post('/watchlist', async function (req, res) {
  const { symbol, token } = req.body
  const query = `INSERT INTO watchlists (stock_symbol, token) VALUES ('${symbol}', '${token}')`
  try {
    await db.query(query)
    res.send('Added to watchlist')
  } catch (err) {
    console.log(err)
    res.status(500).send((err as Error).message)
  }
})

app.get('/watchlist', async function (req, res) {
  const { token } = req.query
  const query = `SELECT stock_symbol FROM watchlists WHERE token = '${token}'`
  try {
    const result = await db.query(query)
    res.send(result[0])
  } catch (err) {
    console.log(err)
    res.status(500).send((err as Error).message)
  }
})

app.delete('/watchlist', async function (req, res) {
  const { symbol, token } = req.body
  const query = `DELETE FROM watchlists WHERE stock_symbol = '${symbol}' AND token = '${token}'`
  try {
    await db.query(query)
    res.send('Deleted from watchlist')
  } catch (err) {
    console.log(err)
    res.status(500).send((err as Error).message)
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}.`)
})
