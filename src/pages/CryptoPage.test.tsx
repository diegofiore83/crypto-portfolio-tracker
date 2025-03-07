import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CryptoPage from "../pages/CryptoPage";
import { CryptoAsset, CryptoState } from "../store/types";
import cryptoReducer from "../store/slices/crypto-slice";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../components/HistoricChart", () => ({
  __esModule: true,
  default: () => <div data-testid="historic-chart">Chart Component</div>,
}));

const initialState: { crypto: CryptoState } = {
  crypto: {
    assets: {
      bitcoin: {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        image: "https://example.com/bitcoin.png",
        current_price: 50000,
        price_change_percentage_24h: 2.5,
      } as CryptoAsset,
    },
    status: "idle" as const,
  },
};

const renderWithProviders = (
  storeState: { crypto: CryptoState },
  route = "/crypto/bitcoin"
) => {
  const store = configureStore({
    reducer: {
      crypto: cryptoReducer,
    },
    preloadedState: storeState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/crypto/:id" element={<CryptoPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("CryptoPage Component", () => {
  test("displays loading state when data is loading", () => {
    const storeState = {
      crypto: { ...initialState.crypto, status: "loading" as const },
    };

    renderWithProviders(storeState);

    expect(
      screen.getByText(/Loading cryptocurrency data.../i)
    ).toBeInTheDocument();
  });

  test("displays error state when data loading fails", () => {
    const storeState = {
      crypto: { ...initialState.crypto, status: "failed" as const },
    };

    renderWithProviders(storeState);

    expect(
      screen.getByText(/Failed to load cryptocurrency data/i)
    ).toBeInTheDocument();
  });

  test("displays 'Crypto not found' when id is invalid", () => {
    const storeState = {
      crypto: { ...initialState.crypto, status: "idle" as const },
    };

    renderWithProviders(storeState, "/crypto/unknown-crypto");

    expect(screen.getByText(/Crypto not found/i)).toBeInTheDocument();
  });

  test("renders crypto details correctly", () => {
    renderWithProviders(initialState);

    expect(screen.getByText(/Bitcoin \(BTC\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Price: \$50,000/i)).toBeInTheDocument();
    expect(screen.getByText(/\+2.50% \(24h\)/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Bitcoin/i)).toBeInTheDocument();
  });

  test("renders HistoricChart component", () => {
    renderWithProviders(initialState);
    expect(screen.getByTestId("historic-chart")).toBeInTheDocument();
  });

  test("navigates back when clicking 'Go Back' button", () => {
    renderWithProviders(initialState);

    fireEvent.click(screen.getByText(/Go Back/i));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
