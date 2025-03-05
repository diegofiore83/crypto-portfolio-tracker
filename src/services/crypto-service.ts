import axios from "axios";
import { CryptoAsset, MarketData } from "./crypto-types";

const CryptoService = {
  async getCoinList(): Promise<CryptoAsset[]> {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching coin list:", error);
      throw new Error("Failed to fetch coin list.");
    }
  },
  async getCoinHistory(
    id: string,
    abortSignal?: AbortSignal
  ): Promise<MarketData> {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: 30,
            interval: "daily",
          },
          signal: abortSignal, // Allow request cancellation
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request cancelled:", id);
      } else {
        console.error(`Error fetching history for ${id}:`, error);
      }
      throw new Error("Failed to fetch coin history.");
    }
  },
};

export default CryptoService;
