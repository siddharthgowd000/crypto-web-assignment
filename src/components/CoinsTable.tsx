"use client";

import React from "react";
import Image from "next/image";
import { Coin, SortConfig } from "@/types/crypto";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getChangeColor,
} from "@/services/api";
import { TableSkeleton } from "./ui/LoadingSkeleton";

interface CoinsTableProps {
  coins: Coin[];
  loading: boolean;
  sortConfig: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

interface SortableHeaderProps {
  field: SortConfig["field"];
  children: React.ReactNode;
  sortConfig: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
}

function SortableHeader({
  field,
  children,
  sortConfig,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortConfig.field === field;

  return (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {isActive && (
          <span className="text-gray-400">
            {sortConfig.direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );
}

export function CoinsTable({
  coins,
  loading,
  sortConfig,
  onSort,
  hasMore,
  onLoadMore,
}: CoinsTableProps) {
  if (loading && coins.length === 0) {
    return <TableSkeleton />;
  }

  if (coins.length === 0) {
    return (
      <div className="text-center py-12">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-lg font-medium">No coins found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <SortableHeader
                field="market_cap_rank"
                sortConfig={sortConfig}
                onSort={onSort}
              >
                #
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Coin
              </th>
              <SortableHeader
                field="current_price"
                sortConfig={sortConfig}
                onSort={onSort}
              >
                Price
              </SortableHeader>
              <SortableHeader
                field="price_change_percentage_24h"
                sortConfig={sortConfig}
                onSort={onSort}
              >
                24h Change
              </SortableHeader>
              <SortableHeader
                field="market_cap"
                sortConfig={sortConfig}
                onSort={onSort}
              >
                Market Cap
              </SortableHeader>
              <SortableHeader
                field="total_volume"
                sortConfig={sortConfig}
                onSort={onSort}
              >
                24h Volume
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {coin.market_cap_rank}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={coin.image}
                        alt={`${coin.name} logo`}
                        width={32}
                        height={32}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-coin.svg";
                        }}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {coin.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatCurrency(coin.current_price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col">
                    <span
                      className={getChangeColor(
                        coin.price_change_percentage_24h
                      )}
                    >
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(coin.price_change_24h)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  ${formatNumber(coin.market_cap)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  ${formatNumber(coin.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
