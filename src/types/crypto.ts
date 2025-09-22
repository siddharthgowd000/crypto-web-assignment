export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface TrendingCoin {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

export interface TrendingItem {
  item: TrendingCoin;
}

export interface TrendingResponse {
  coins: TrendingItem[];
  exchanges: any[];
}

export interface MarketDataParams {
  vs_currency?: string;
  order?:
    | "market_cap_desc"
    | "market_cap_asc"
    | "volume_desc"
    | "volume_asc"
    | "id_desc"
    | "id_asc"
    | "gecko_desc"
    | "gecko_asc"
    | "price_desc"
    | "price_asc"
    | "price_change_percentage_desc"
    | "price_change_percentage_asc"
    | "market_cap_change_percentage_desc"
    | "market_cap_change_percentage_asc";
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
  category?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export type SortField =
  | "market_cap_rank"
  | "current_price"
  | "price_change_percentage_24h"
  | "market_cap"
  | "total_volume";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
