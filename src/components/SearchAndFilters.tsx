"use client";

import React from "react";
import { SortConfig } from "@/types/crypto";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortConfig: SortConfig;
  onSortChange: (field: SortConfig["field"]) => void;
  loading: boolean;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  sortConfig,
  onSortChange,
  loading,
}: SearchAndFiltersProps) {
  const sortOptions = [
    { field: "market_cap_rank" as const, label: "Market Cap Rank" },
    { field: "current_price" as const, label: "Price" },
    { field: "price_change_percentage_24h" as const, label: "24h Change" },
    { field: "market_cap" as const, label: "Market Cap" },
    { field: "total_volume" as const, label: "24h Volume" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search coins
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="sm:w-48">
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={sortConfig.field}
            onChange={(e) =>
              onSortChange(e.target.value as SortConfig["field"])
            }
            disabled={loading}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sortOptions.map((option) => (
              <option key={option.field} value={option.field}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onSortChange(sortConfig.field)}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={`Sort ${
            sortConfig.direction === "asc" ? "descending" : "ascending"
          }`}
        >
          <svg
            className={`h-5 w-5 transform transition-transform ${
              sortConfig.direction === "desc" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {searchTerm && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Search: "{searchTerm}"
            <button
              onClick={() => onSearchChange("")}
              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                <path
                  d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </span>
        )}

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          Sort:{" "}
          {sortOptions.find((opt) => opt.field === sortConfig.field)?.label} (
          {sortConfig.direction})
        </span>
      </div>
    </div>
  );
}
