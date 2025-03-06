import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { useAppDispatch } from "./store/hooks";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import cryptoReducer from "./store/slices/crypto-slice";
import CryptoPage from "./pages/CryptoPage";
import { CryptoState } from "./store/types";

jest.mock("@fontsource/montserrat/400.css", () => null);
jest.mock("@fontsource/montserrat/700.css", () => null);

// Mock Store
const preloadedState: { crypto: CryptoState } = {
  crypto: {
    assets: {}, // ✅ Must be an object, not an array
    status: "idle",
  },
};

const store = configureStore({
  reducer: { crypto: cryptoReducer },
  preloadedState,
});

jest.mock("./store/hooks", () => ({
  ...jest.requireActual("./store/hooks"),
  useAppDispatch: jest.fn(),
}));

const dispatchMock = jest.fn();
(useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);

// Mock Components
jest.mock("./pages/PortfolioPage", () => () => (
  <div data-testid="portfolio-page">Portfolio Page</div>
));
jest.mock("./pages/CryptoPage", () => () => (
  <div data-testid="crypto-page">Coin Page</div>
));
jest.mock("./components/Header", () => () => (
  <header data-testid="header">Header</header>
));

describe("App Component", () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  test("renders Header and PortfolioPage by default", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("portfolio-page")).toBeInTheDocument();
  });

  test("navigates to CoinsPage when visiting a crypto route", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/coins/bitcoin"]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/coins/:id" element={<CryptoPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("crypto-page")).toBeInTheDocument();
  });

  test("shows 'Not found' for an unknown route", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/unknown-route"]}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Page not found.")).toBeInTheDocument();
  });

  test("dispatches fetchCryptoAssets on mount", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
