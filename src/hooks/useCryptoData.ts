import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Coin,
  TrendingResponse,
  SortConfig,
  MarketDataParams,
} from "@/types/crypto";
import { CoinGeckoService } from "@/services/api";

export function useMarketData() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "market_cap_rank",
    direction: "asc",
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMarketData = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const params: MarketDataParams = {
          page: pageNum,
          per_page: 50,
          vs_currency: "usd",
          order:
            sortConfig.field === "market_cap_rank"
              ? "market_cap_desc"
              : sortConfig.field === "current_price"
              ? "price_desc"
              : sortConfig.field === "price_change_percentage_24h"
              ? "price_change_percentage_desc"
              : sortConfig.field === "market_cap"
              ? "market_cap_desc"
              : "volume_desc",
          price_change_percentage: "24h",
        };

        const response = await CoinGeckoService.getMarketData(params);

        if (response.success && response.data) {
          if (append) {
            setCoins((prev) => [...prev, ...response.data]);
          } else {
            setCoins(response.data);
          }
          setHasMore(response.data.length === 50);
        } else {
          setError(response.error || "Failed to fetch market data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [sortConfig]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMarketData(nextPage, true);
    }
  }, [loading, hasMore, page, fetchMarketData]);

  const filteredCoins = useMemo(() => {
    if (!debouncedSearchTerm) return coins;

    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [coins, debouncedSearchTerm]);

  const sortedCoins = useMemo(() => {
    if (!debouncedSearchTerm) return filteredCoins;

    return [...filteredCoins].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      }

      return 0;
    });
  }, [filteredCoins, sortConfig]);

  const updateSort = useCallback((field: SortConfig["field"]) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchMarketData(1, false);
    }
  }, [sortConfig, fetchMarketData, debouncedSearchTerm]);

  useEffect(() => {
    fetchMarketData(1, false);
  }, []);

  return {
    coins: sortedCoins,
    loading,
    error,
    hasMore,
    searchTerm,
    setSearchTerm,
    sortConfig,
    updateSort,
    loadMore,
    refetch: () => fetchMarketData(1, false),
  };
}

export function useTrendingCoins() {
  const [trending, setTrending] = useState<TrendingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await CoinGeckoService.getTrendingCoins();

      if (response.success && response.data) {
        setTrending(response.data);
      } else {
        setError(response.error || "Failed to fetch trending coins");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    trending,
    loading,
    error,
    refetch: fetchTrending,
  };
}

export function useHighlights() {
  const [topGainers, setTopGainers] = useState<Coin[]>([]);
  const [topLosers, setTopLosers] = useState<Coin[]>([]);
  const [highestVolume, setHighestVolume] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [gainersResponse, losersResponse, volumeResponse] =
        await Promise.all([
          CoinGeckoService.getTopGainers(10),
          CoinGeckoService.getTopLosers(10),
          CoinGeckoService.getHighestVolume(10),
        ]);

      if (gainersResponse.success && gainersResponse.data) {
        setTopGainers(gainersResponse.data);
      }

      if (losersResponse.success && losersResponse.data) {
        setTopLosers(losersResponse.data);
      }

      if (volumeResponse.success && volumeResponse.data) {
        setHighestVolume(volumeResponse.data);
      }

      if (
        !gainersResponse.success ||
        !losersResponse.success ||
        !volumeResponse.success
      ) {
        setError("Failed to fetch some highlight data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return {
    topGainers,
    topLosers,
    highestVolume,
    loading,
    error,
    refetch: fetchHighlights,
  };
}

export function useCoinDetails(coinId: string | null) {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoinDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await CoinGeckoService.getCoinDetails(id);

      if (response.success && response.data) {
        setCoin(response.data);
      } else {
        setError(response.error || "Failed to fetch coin details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coinId) {
      fetchCoinDetails(coinId);
    } else {
      setCoin(null);
    }
  }, [coinId, fetchCoinDetails]);

  return {
    coin,
    loading,
    error,
    refetch: () => coinId && fetchCoinDetails(coinId),
  };
}
