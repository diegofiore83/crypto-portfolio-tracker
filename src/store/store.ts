import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./slices/crypto-slice";
import portfolioReducer from "./slices/portfolio-slice";

const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    portfolio: portfolioReducer,
  },
});

// TypeScript types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
