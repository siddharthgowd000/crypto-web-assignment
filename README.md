# Crypto Dashboard

A modern cryptocurrency dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This application provides real-time market data and comprehensive cryptocurrency analysis powered by the CoinGecko API.

used AI tool for readme file generation.

## 🚀 Live Demo
[View Live Demo](https://crypto-web-assignment-nine.vercel.app/)

## ✨ Features

- **Real-time Market Data** - Live cryptocurrency prices, market caps, and trading volumes
- **Market Highlights** - Top gainers, losers, and trending coins
- **Advanced Search & Filtering** - Search by name/symbol with real-time filtering
- **Interactive Sorting** - Sort by price, market cap, volume, and 24h change
- **Detailed Coin Views** - Comprehensive coin details and statistics
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Mode Support** - Automatic theme switching

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **CoinGecko API** - Cryptocurrency market data
- **Custom Hooks** - React hooks for state management and data fetching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/siddharthgowd000/Crypto-Web
cd crypto-web-assignment

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm run start
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
│   ├── CoinsTable.tsx    # Main coins table
│   ├── HighlightsSection.tsx # Market highlights
│   ├── SearchAndFilters.tsx  # Search and filtering
│   └── CoinDetailModal.tsx   # Coin detail modal
├── hooks/                # Custom React hooks
│   └── useCryptoData.ts  # Data fetching hooks
├── services/             # API services
│   └── api.ts           # CoinGecko API service
└── types/               # TypeScript definitions
    └── crypto.ts        # Cryptocurrency types
```

## 🔧 Key Implementation Details

### Custom Hooks Pattern

- `useMarketData` - Market data with pagination, search, and sorting
- `useHighlights` - Top gainers, losers, and volume data
- `useTrendingCoins` - Trending cryptocurrency data
- `useCoinDetails` - Individual coin information

### Performance Optimizations

- Client-side caching (1-minute cache for API responses)
- Debounced search (300ms delay to reduce API calls)
- Efficient pagination and loading states
- Error handling with retry mechanisms

### API Integration

- Centralized API service layer
- Type-safe data transformation
- Rate limiting and caching strategies
- Comprehensive error handling

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Loading States** - Skeleton loaders and smooth transitions
- **Error Handling** - User-friendly error messages and retry options

## 📊 API Usage

The application uses the CoinGecko API with the following endpoints:

- `GET /coins/markets` - Market data for all coins
- `GET /search/trending` - Trending coins
- `GET /coins/{id}` - Individual coin details


---


