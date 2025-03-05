import axios from "axios";
import CryptoService from "./crypto-service";
import { CryptoAsset, MarketData } from "./crypto-types";

jest.mock("axios");

describe("CryptoService", () => {
  test("should fetch coin list", async () => {
    const mockData: CryptoAsset[] = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://example.com/bitcoin.png",
        current_price: 45000,
        market_cap: 850000000000,
        market_cap_rank: 1,
        total_volume: 35000000000,
        high_24h: 46000,
        low_24h: 44000,
        price_change_24h: -500,
        price_change_percentage_24h: -1.1,
        market_cap_change_24h: -10000000000,
        market_cap_change_percentage_24h: -1.2,
        circulating_supply: 19000000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 65000,
        ath_change_percentage: -30,
        ath_date: "2021-04-14T00:00:00.000Z",
        atl: 67.81,
        atl_change_percentage: 66300,
        atl_date: "2013-07-06T00:00:00.000Z",
        roi: null,
        last_updated: "2021-09-01T00:00:00.000Z",
        fully_diluted_valuation: 850000000000,
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://example.com/ethereum.png",
        current_price: 3000,
        market_cap: 350000000000,
        market_cap_rank: 2,
        total_volume: 20000000000,
        high_24h: 3100,
        low_24h: 2900,
        price_change_24h: -50,
        price_change_percentage_24h: -1.6,
        market_cap_change_24h: -5000000000,
        market_cap_change_percentage_24h: -1.4,
        circulating_supply: 115000000,
        total_supply: 115000000,
        max_supply: null,
        ath: 4300,
        ath_change_percentage: -30,
        ath_date: "2021-05-12T00:00:00.000Z",
        atl: 0.432979,
        atl_change_percentage: 692000,
        atl_date: "2015-10-20T00:00:00.000Z",
        roi: null,
        last_updated: "2021-09-01T00:00:00.000Z",
        fully_diluted_valuation: 350000000000,
      },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CryptoService.getCoinList();
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
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
  });

  test("handles API failure getting coin list", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => null);
    (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(CryptoService.getCoinList()).rejects.toThrow(
      "Failed to fetch coin list."
    );
    spy.mockRestore();
  });

  test("should fetch coin history", async () => {
    const mockData: MarketData = {
      prices: [
        [1738530045736, 97793.53821562871],
        [1738533735812, 96988.74415938454],
        [1738537427863, 97815.84535257479],
      ],
      market_caps: [
        [1738530045736, 1937072986217.3457],
        [1738533735812, 1921781912853.0679],
        [1738537427863, 1936077131894.8628],
      ],
      total_volumes: [
        [1738530045736, 0],
        [1738533735812, 0],
        [1738537427863, 0],
      ],
    };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CryptoService.getCoinHistory("bitcoin");
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
      {
        params: {
          vs_currency: "usd",
          days: 30,
          interval: "daily",
        },
        signal: undefined,
      }
    );
  });

  test("handles API failure for coin history", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => null);
    (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(CryptoService.getCoinHistory("bitcoin")).rejects.toThrow(
      "Failed to fetch coin history."
    );
    spy.mockRestore();
  });
});
