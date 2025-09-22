import {
  Coin,
  TrendingResponse,
  MarketDataParams,
  ApiResponse,
} from "@/types/crypto";

const CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_COINGECKO_API_URL ||
    "https://api.coingecko.com/api/v3",
  API_KEY: process.env.COINGECKO_API_KEY || "",
  CACHE_DURATION: 60000, // 1 minute
  REVALIDATE_TIME: 60, // Next.js revalidation
  MAX_CACHE_SIZE: 100, // Prevent memory leaks
} as const;

class ApiCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private maxSize = CONFIG.MAX_CACHE_SIZE;

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > CONFIG.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  set<T>(key: string, data: T): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new ApiCache();

const buildUrl = (
  endpoint: string,
  params: Record<string, unknown> = {}
): string => {
  const url = new URL(CONFIG.BASE_URL + endpoint);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
};

const getCacheKey = (
  endpoint: string,
  params: Record<string, unknown>
): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, unknown>);

  return `${endpoint}?${JSON.stringify(sortedParams)}`;
};

async function makeRequest<T>(
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  const cacheKey = getCacheKey(endpoint, params);

  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return { data: cachedData, success: true };
  }

  try {
    const url = buildUrl(endpoint, params);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (CONFIG.API_KEY) {
      headers["x-cg-demo-api-key"] = CONFIG.API_KEY;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: CONFIG.REVALIDATE_TIME },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    apiCache.set(cacheKey, data);

    return { data, success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`API request failed for ${endpoint}:`, errorMessage);

    return {
      data: null as T,
      success: false,
      error: errorMessage,
    };
  }
}

const DEFAULT_MARKET_PARAMS: MarketDataParams = {
  vs_currency: "usd",
  order: "market_cap_desc",
  per_page: 50,
  page: 1,
  sparkline: false,
  price_change_percentage: "24h",
};

export class CoinGeckoService {
  static async getMarketData(
    params: MarketDataParams = {}
  ): Promise<ApiResponse<Coin[]>> {
    const mergedParams = { ...DEFAULT_MARKET_PARAMS, ...params };
    return makeRequest<Coin[]>("/coins/markets", mergedParams);
  }

  static async getTrendingCoins(): Promise<ApiResponse<TrendingResponse>> {
    return makeRequest<TrendingResponse>("/search/trending");
  }

  static async getCoinDetails(coinId: string): Promise<ApiResponse<Coin>> {
    return makeRequest<Coin>(`/coins/${coinId}`, {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    });
  }

  static async getTopGainers(limit = 10): Promise<ApiResponse<Coin[]>> {
    return this.getMarketData({
      order: "price_change_percentage_desc",
      per_page: limit,
      page: 1,
    });
  }

  static async getTopLosers(limit = 10): Promise<ApiResponse<Coin[]>> {
    return this.getMarketData({
      order: "price_change_percentage_asc",
      per_page: limit,
      page: 1,
    });
  }

  static async getHighestVolume(limit = 10): Promise<ApiResponse<Coin[]>> {
    return this.getMarketData({
      order: "volume_desc",
      per_page: limit,
      page: 1,
    });
  }

  static clearCache(): void {
    apiCache.clear();
  }
}

export const formatCurrency = (value: number, currency = "USD"): string => {
  if (!Number.isFinite(value)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "N/A";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12) {
    return `${sign}${(absValue / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(2)}K`;
  }

  return `${sign}${absValue.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  if (!Number.isFinite(value)) return "N/A";

  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

export const getChangeColor = (value: number): string => {
  if (!Number.isFinite(value)) return "text-gray-600 dark:text-gray-400";

  if (value > 0) return "text-green-600 dark:text-green-400";
  if (value < 0) return "text-red-600 dark:text-red-400";
  return "text-gray-600 dark:text-gray-400";
};

export const formatMarketCap = (value: number): string => {
  return formatNumber(value);
};

export const formatVolume = (value: number): string => {
  return formatNumber(value);
};

export const formatPrice = (value: number): string => {
  return formatCurrency(value);
};

export const getPriceChangeIcon = (value: number): string => {
  if (!Number.isFinite(value)) return "→";
  return value >= 0 ? "↗" : "↘";
};
