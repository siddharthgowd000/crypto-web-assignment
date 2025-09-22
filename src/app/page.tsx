"use client";

import React from "react";
import {
  useMarketData,
  useHighlights,
  useTrendingCoins,
} from "@/hooks/useCryptoData";
import { CoinsTable } from "@/components/CoinsTable";
import { HighlightsSection } from "@/components/HighlightsSection";
import { SearchAndFilters } from "@/components/SearchAndFilters";

export default function Home() {
  const {
    coins,
    loading: marketLoading,
    error: marketError,
    hasMore,
    searchTerm,
    setSearchTerm,
    sortConfig,
    updateSort,
    loadMore,
    refetch: refetchMarket,
  } = useMarketData();

  const {
    topGainers,
    topLosers,
    highestVolume,
    loading: highlightsLoading,
    error: highlightsError,
  } = useHighlights();

  const {
    trending,
    loading: trendingLoading,
    error: trendingError,
  } = useTrendingCoins();

  const hasError = marketError || highlightsError || trendingError;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Crypto Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time cryptocurrency market data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetchMarket}
                disabled={marketLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {marketLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Some data failed to load
                </h3>
                <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {marketError && <p>Market data: {marketError}</p>}
                  {highlightsError && <p>Highlights: {highlightsError}</p>}
                  {trendingError && <p>Trending: {trendingError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="mb-8">
          <HighlightsSection
            topGainers={topGainers}
            topLosers={topLosers}
            highestVolume={highestVolume}
            trending={trending?.coins || []}
            loading={highlightsLoading || trendingLoading}
            error={highlightsError || trendingError}
          />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              All Coins
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and search through all available cryptocurrencies
            </p>
          </div>

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortConfig={sortConfig}
            onSortChange={updateSort}
            loading={marketLoading}
          />

          <CoinsTable
            coins={coins}
            loading={marketLoading}
            sortConfig={sortConfig}
            onSort={updateSort}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Data provided by CoinGecko API</p>
            <p className="text-sm mt-1">
              Last updated:{" "}
              <span suppressHydrationWarning>
                {new Date().toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
