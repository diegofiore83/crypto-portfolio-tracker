import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CryptoHolding } from "../types";

const loadFromLocalStorage = (): CryptoHolding[] => {
  const data = localStorage.getItem("portfolio");
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (state: CryptoHolding[]) => {
  localStorage.setItem("portfolio", JSON.stringify(state));
};

const initialState: CryptoHolding[] = loadFromLocalStorage();

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addCrypto: (state, action: PayloadAction<CryptoHolding>) => {
      state.push(action.payload);
      saveToLocalStorage(state);
    },
    editCrypto: (state, action: PayloadAction<CryptoHolding>) => {
      const index = state.findIndex(
        (crypto) => crypto.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
        saveToLocalStorage(state);
      }
    },
    deleteCrypto: (state, action: PayloadAction<string>) => {
      const newState = state.filter((crypto) => crypto.id !== action.payload);
      saveToLocalStorage(newState);
      return newState;
    },
  },
});

export const { addCrypto, editCrypto, deleteCrypto } = portfolioSlice.actions;
export default portfolioSlice.reducer;
