import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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

    mockUseAppSelector.mockImplementation(
      (selector: (state: RootState) => unknown) => {
        const mockState: RootState = {
          portfolio: [],
          crypto: { assets: {}, status: "idle" },
        };
        return selector(mockState);
      }
    );

    jest.clearAllMocks();
  });

  test("displays loading state when status is 'loading'", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "loading" },
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
        crypto: { assets: {}, status: "failed" },
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

  test("displays message when portfolio is empty", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: { assets: {}, status: "idle" },
      };
      return selector === selectEnrichedPortfolio ? [] : selector(mockState);
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PortfolioPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(
        "You can add more cryptocurrencies to your portfolio by clicking on the cards below."
      )
    ).toBeInTheDocument();
  });

  test("does not display empty portfolio message when holdings exist", () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [{ id: "bitcoin", quantity: 2 }],
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

    expect(
      screen.queryByText(
        "You can add more cryptocurrencies to your portfolio by clicking on the cards below."
      )
    ).not.toBeInTheDocument();
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

  test("search and filter cryptos when assets loaded", async () => {
    mockUseAppSelector.mockImplementation((selector) => {
      const mockState: RootState = {
        portfolio: [],
        crypto: {
          assets: {
            bitcoin: mockCryptoAssets[0],
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

    fireEvent.change(screen.getByLabelText("Search Cryptocurrencies"), {
      target: { value: "Eth" },
    });
    await waitFor(
      () => {
        expect(screen.queryByText(/ethereum/i)).toBeInTheDocument();
        expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
      },
      {
        timeout: 500,
      }
    );
  });
});
