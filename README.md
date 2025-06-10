# Stocks Dashboard

This project consists of a Next.js frontend and an Express.js backend. The frontend displays stock data that is updated in real-time via a WebSocket connection to the backend.
<br />

<a href="https://stocks-dashboard-pi.vercel.app/">View Demo</a>

## Prerequisites

- Node.js
- npm

## Getting Started

### Backend

1. Navigate to the server directory:

```sh
cd server
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env` file in the `server` directory with the following content:

```
MYSQL_HOST=*your_mysql_host*
MYSQL_USER=*your_mysql_user*
MYSQL_PASSWORD=*your_mysql_password*
MYSQL_DATABASE=*your_mysql_database*
```

### Data Source Configuration

The application supports two data modes:

**Simulated Data Mode**

- Uses realistic simulated stock data with price fluctuations
- No API rate limits or external dependencies
- Reliable for demos and production deployments
- This is the default mode when no configuration is provided

**Live API Mode**

- Fetches real stock data from external APIs
- May hit rate limits and cause service interruptions
- Requires API credentials to be configured

To configure the data source, add the following to your `.env` file:

```
# For live API data (optional - may hit rate limits)
REALSTONKS_API_KEY=*your_api_key*
REALSTONKS_API_URL=*your_api_url*
USE_REAL_DATA=true

# Leave USE_REAL_DATA unset or set to false for simulated data (recommended)
```

**Note**: The deployed demo uses simulated data to ensure consistent availability for viewers.

4. Start the server:

```sh
npm run dev
```

The server will start on port 5000.

### Frontend

1. Navigate to the client directory:

```sh
cd client
```

2. Install dependencies:

```sh
npm install
```

3. Start the frontend:

```sh
npm run dev
```

The frontend will start on port 3000.

## Testing

### Backend

1. Navigate to the server directory:

```sh
cd server
```

2. Run tests:

```sh
npm test
```

## Features

- Real-time stock data updates (simulated or live API)
- Configurable data source (simulated for reliability, live API for development)
- Add stocks to a watchlist
- Remove stocks from the watchlist
- Filter stocks by watchlist

## Technologies

### Frontend

- Next.js
- React
- Shadcn/ui
- React Query
- TypeScript
- JavaScript

### Backend

- Express
- MySQL
- WebSocket
- TypeScript
- JavaScript

## Screenshots

![Home Page](StocksDash.png)

## License

Distributed under the MIT License. See `LICENSE` for more information.
