import express from 'express'
import bodyParser from 'body-parser'
// Start the WebSocket server
import('./websocket')

// Start simulating stock data updates
import('./stockDataStream')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('<h1>Stock Dashboard API</h1>')
})

app.listen(port, function () {
  console.log(`Listening on port ${port}.`)
})
