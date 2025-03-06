import axios from "axios";
import CryptoService from "./crypto-service";
import { CryptoAsset, MarketData } from "../store/types";
import { mockCryptoAssets, mockMarketData } from "../store/fixtures";

jest.mock("axios");

describe("CryptoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch crypto list", async () => {
    const mockData: CryptoAsset[] = mockCryptoAssets;
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CryptoService.getCryptoList();
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      "https://crypto.neapoliswebdigital.com/api/crypto/list"
    );
  });

  test("handles API failure getting crypto list", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => null);
    (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(CryptoService.getCryptoList()).rejects.toThrow(
      "Failed to fetch crypto list."
    );
    spy.mockRestore();
  });

  test("should fetch crypto history", async () => {
    const mockData: MarketData = mockMarketData;
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await CryptoService.getCryptoHistory("bitcoin");
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      "https://crypto.neapoliswebdigital.com/api/crypto/market-chart?id=bitcoin",
      {
        signal: undefined,
      }
    );
  });

  test("handles API failure for crypto history", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => null);
    (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(CryptoService.getCryptoHistory("bitcoin")).rejects.toThrow(
      "Failed to fetch crypto history."
    );
    spy.mockRestore();
  });
});
