import axios from "axios";
import { CryptoAsset, MarketData } from "./crypto-types";

const CryptoService = {
  async getCoinList(): Promise<CryptoAsset[]> {
    try {
      const response = await axios.get(
        "https://crypto.neapoliswebdigital.com/api/crypto/list"
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
        `https://crypto.neapoliswebdigital.com/api/crypto/market-chart?id=${id}`,
        {
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
