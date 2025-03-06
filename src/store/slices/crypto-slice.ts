import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CryptoService from "../../services/crypto-service";
import { AssetsDictionary, CryptoAsset, CryptoState } from "../types";

const initialState: CryptoState = {
  assets: {},
  status: "idle",
};

// Fetch crypto assets from the API using CryptoService
export const fetchCryptoAssets = createAsyncThunk(
  "crypto/fetchAssets",
  async () => {
    const assetArray = await CryptoService.getCryptoList();

    // Convert array to dictionary for fast lookups
    const assetsDictionary: Record<string, CryptoAsset> = assetArray.reduce(
      (acc: Record<string, CryptoAsset>, asset: CryptoAsset) => {
        acc[asset.id] = asset;
        return acc;
      },
      {} as AssetsDictionary
    );

    return assetsDictionary;
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoAssets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCryptoAssets.fulfilled, (state, action) => {
        state.status = "idle";
        state.assets = action.payload;
      })
      .addCase(fetchCryptoAssets.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default cryptoSlice.reducer;
