import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
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
      toast.success(
        `${action.payload.id.toUpperCase()} added to your portfolio!`
      );
    },
    editCrypto: (state, action: PayloadAction<CryptoHolding>) => {
      const index = state.findIndex(
        (crypto) => crypto.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
        saveToLocalStorage(state);
        toast.info(
          `Updated ${action.payload.id.toUpperCase()} quantity to ${
            action.payload.quantity
          }.`
        );
      }
    },
    deleteCrypto: (state, action: PayloadAction<string>) => {
      const newState = state.filter((crypto) => crypto.id !== action.payload);
      saveToLocalStorage(newState);
      toast.error(
        `${action.payload.toUpperCase()} removed from your portfolio.`
      );
      return newState;
    },
  },
});

export const { addCrypto, editCrypto, deleteCrypto } = portfolioSlice.actions;
export default portfolioSlice.reducer;
