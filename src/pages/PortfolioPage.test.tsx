import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PortfolioPage from "./PortfolioPage";
import portfolioReducer from "../store/slices/portfolio-slice";
import cryptoReducer from "../store/slices/crypto-slice";
import { selectEnrichedPortfolio } from "../store/selectors/portfolio-selectors";
import { MemoryRouter } from "react-router-dom";
import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { mockCryptoAssets } from "../store/fixtures";

// Mock Components
jest.mock("../components/Loading", () => () => (
  <div>Loading your portfolio and crypto assets...</div>
));
jest.mock("../components/Error", () => ({ message }: { message: string }) => (
  <div>{message}</div>
));
jest.mock("../components/HoldingCard", () => ({ id }: { id: string }) => (
  <div>Holding: {id}</div>
));
jest.mock("../components/CryptoCard", () => ({ id }: { id: string }) => (
  <div>Crypto: {id}</div>
));

// ✅ Correctly Mock `useAppSelector` with TypeScript
jest.mock("../store/hooks", () => ({
  useAppSelector: jest.fn(),
}));
const mockUseAppSelector = useAppSelector as jest.Mock;

// Mock ScrollTo
global.scrollTo = jest.fn();

describe("PortfolioPage Component", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { portfolio: portfolioReducer, crypto: cryptoReducer },
      preloadedState: {
        portfolio: [],
        crypto: { assets: {}, status: "idle" },
      } as RootState,
    });

    // ✅ Ensure mock always returns a valid state
    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => unknown) => {
        const mockState: RootState = {
          portfolio: [],
          crypto: { assets: {}, status: "idle" },
        };
        return selector(mockState);
      }
    );

    jest.clearAllMocks(); // ✅ Prevents stale mock data between tests
  });

  test("displays loading state when status is 'loading'", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "loading" }, // ✅ Simulate loading state
      };
      return selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("Loading your portfolio and crypto assets...")
    ).toBeInTheDocument();
  });

  test("displays error state when status is 'failed'", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "failed" }, // ✅ Simulate error state
      };
      return selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("We couldn't load the cryptocurrency data.")
    ).toBeInTheDocument();
  });

  test("renders holdings when enrichedPortfolio is not empty", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "idle" },
      };
      return selector === selectEnrichedPortfolio
        ? [{ id: "bitcoin" }]
        : selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Holding: bitcoin")).toBeInTheDocument();
  });

  test("renders available cryptos when assets exist", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: {
          assets: {
            ethereum: mockCryptoAssets[1],
          },
          status: "idle",
        },
      };
      return selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Crypto: ethereum")).toBeInTheDocument();
  });

  test("scrolls to top when a new crypto is added", async () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "idle" },
      };
      return selector === selectEnrichedPortfolio
        ? [{ id: "bitcoin" }]
        : selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      mockUseAppSelector.mockImplementationOnce((selector) =>
        selector === selectEnrichedPortfolio
          ? [{ id: "ethereum" }]
          : { portfolio: {}, crypto: {} }
      );
    });

    await act(async () => null); // Ensure useEffect runs

    expect(global.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
