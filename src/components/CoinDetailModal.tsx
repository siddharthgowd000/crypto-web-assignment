"use client";

import React from "react";
import Image from "next/image";
import { Coin } from "@/types/crypto";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getChangeColor,
} from "@/services/api";

interface CoinDetailModalProps {
  coin: Coin | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export function CoinDetailModal({
  coin,
  isOpen,
  onClose,
  loading,
}: CoinDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ) : coin ? (
            <>
              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={coin.image}
                      alt={`${coin.name} logo`}
                      width={40}
                      height={40}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-coin.svg";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {coin.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(coin.current_price)}
                  </div>
                  <div
                    className={`text-lg ${getChangeColor(
                      coin.price_change_percentage_24h
                    )}`}
                  >
                    {formatPercentage(coin.price_change_percentage_24h)} (
                    {formatCurrency(coin.price_change_24h)})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Market Cap
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      ${formatNumber(coin.market_cap)}
                    </div>
                    <div
                      className={`text-xs ${getChangeColor(
                        coin.market_cap_change_percentage_24h
                      )}`}
                    >
                      {formatPercentage(coin.market_cap_change_percentage_24h)}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      24h Volume
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      ${formatNumber(coin.total_volume)}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rank
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      #{coin.market_cap_rank}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Circulating Supply
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(coin.circulating_supply)}{" "}
                      {coin.symbol.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    24h Price Range
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Low
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      High
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-red-600 dark:text-red-400">
                      {formatCurrency(coin.low_24h)}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      {formatCurrency(coin.high_24h)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      All Time High
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(coin.ath)}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {formatPercentage(coin.ath_change_percentage)} from ATH
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      All Time Low
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(coin.atl)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {formatPercentage(coin.atl_change_percentage)} from ATL
                    </div>
                  </div>
                </div>

                {coin.total_supply && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Supply
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(coin.total_supply)}{" "}
                      {coin.symbol.toUpperCase()}
                    </div>
                  </div>
                )}

                {coin.max_supply && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Max Supply
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(coin.max_supply)}{" "}
                      {coin.symbol.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
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
                <p>Failed to load coin details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
