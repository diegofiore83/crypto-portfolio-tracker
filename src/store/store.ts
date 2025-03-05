import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolio-slice";

const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

// TypeScript types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
