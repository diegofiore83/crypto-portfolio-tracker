import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CryptoHolding } from "../types";

export const selectPortfolio = (state: RootState) => state.portfolio;
export const selectCryptoAssets = (state: RootState) => state.crypto.assets;

export const selectEnrichedPortfolio = createSelector(
  [selectPortfolio, selectCryptoAssets],
  (holdings, cryptoAssets) => {
    return holdings
      .map(({ id, quantity }: CryptoHolding) => {
        const asset = cryptoAssets[id];
        return asset
          ? {
              id,
              quantity,
              name: asset.name,
              symbol: asset.symbol,
              current_price: asset.current_price,
              image: asset.image,
              total_value: asset.current_price * quantity,
            }
          : null;
      })
      .filter(Boolean); // Remove null values
  }
);
