"use client";

import React from "react";
import Image from "next/image";
import { Coin, TrendingItem } from "@/types/crypto";
import {
  formatCurrency,
  formatPercentage,
  getChangeColor,
} from "@/services/api";
import { HighlightCardSkeleton } from "./ui/LoadingSkeleton";

interface HighlightsSectionProps {
  topGainers: Coin[];
  topLosers: Coin[];
  highestVolume: Coin[];
  trending: TrendingItem[];
  loading: boolean;
  error: string | null;
}

interface HighlightCardProps {
  title: string;
  items: Coin[];
  loading: boolean;
}

function HighlightCard({ title, items, loading }: HighlightCardProps) {
  if (loading) {
    return <HighlightCardSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {items.slice(0, 5).map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Image
                className="h-6 w-6 rounded-full"
                src={coin.image}
                alt={`${coin.name} logo`}
                width={24}
                height={24}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-coin.svg";
                }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.symbol.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {coin.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(coin.current_price)}
              </div>
              <div
                className={`text-xs ${getChangeColor(
                  coin.price_change_percentage_24h
                )}`}
              >
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrendingCardProps {
  trending: TrendingItem[];
  loading: boolean;
}

function TrendingCard({ trending, loading }: TrendingCardProps) {
  if (loading) {
    return <HighlightCardSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        🔥 Trending
      </h3>
      <div className="space-y-2">
        {trending.slice(0, 5).map((item) => (
          <div
            key={item.item.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Image
                className="h-6 w-6 rounded-full"
                src={item.item.large}
                alt={`${item.item.name} logo`}
                width={24}
                height={24}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-coin.svg";
                }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.item.symbol.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.item.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Rank #{item.item.market_cap_rank}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Score: {item.item.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HighlightsSection({
  topGainers,
  topLosers,
  highestVolume,
  trending,
  loading,
  error,
}: HighlightsSectionProps) {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
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
          <p className="text-red-800 dark:text-red-200 text-sm">
            Failed to load highlights: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Market Highlights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HighlightCard
          title="📈 Top Gainers"
          items={topGainers}
          loading={loading}
        />

        <HighlightCard
          title="📉 Top Losers"
          items={topLosers}
          loading={loading}
        />

        <HighlightCard
          title="💰 Highest Volume"
          items={highestVolume}
          loading={loading}
        />

        <TrendingCard trending={trending} loading={loading} />
      </div>
    </div>
  );
}
