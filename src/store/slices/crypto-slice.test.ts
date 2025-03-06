import cryptoReducer, { fetchCryptoAssets } from "./crypto-slice";
import { CryptoAsset, CryptoState } from "../types";
import { mockCryptoAssets } from "../fixtures";

jest.mock("../../services/crypto-service", () => ({
  getCryptoList: jest.fn(),
}));

describe("cryptoSlice", () => {
  let initialState: CryptoState;

  beforeEach(() => {
    initialState = {
      assets: {},
      status: "idle",
    };
  });

  test("should return the initial state", () => {
    expect(cryptoReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("should set status to 'loading' when fetchCryptoAssets is pending", () => {
    const newState = cryptoReducer(
      initialState,
      fetchCryptoAssets.pending("", undefined)
    );
    expect(newState.status).toBe("loading");
  });

  test("should populate assets and set status to 'idle' when fetchCryptoAssets is fulfilled", () => {
    const mockAssets: Record<string, CryptoAsset> = {
      bitcoin: mockCryptoAssets[0],
      ethereum: mockCryptoAssets[1],
    };

    const newState = cryptoReducer(
      initialState,
      fetchCryptoAssets.fulfilled(mockAssets, "", undefined)
    );

    expect(newState.status).toBe("idle");
    expect(newState.assets).toEqual(mockAssets);
  });

  test("should set status to 'failed' when fetchCryptoAssets is rejected", () => {
    const newState = cryptoReducer(
      initialState,
      fetchCryptoAssets.rejected(null, "", undefined)
    );
    expect(newState.status).toBe("failed");
  });
});
