import {
  selectPortfolio,
  selectCryptoAssets,
  selectEnrichedPortfolio,
} from "./portfolio-selectors";
import { RootState } from "../store";
import { mockCryptoAssets } from "../fixtures";

describe("portfolioSelectors", () => {
  let mockState: RootState;

  beforeEach(() => {
    mockState = {
      portfolio: [
        { id: "bitcoin", quantity: 2 },
        { id: "ethereum", quantity: 5 },
      ],
      crypto: {
        assets: {
          bitcoin: mockCryptoAssets[0],
          ethereum: mockCryptoAssets[1],
        },
        status: "idle",
      },
    };
  });

  test("should select portfolio holdings", () => {
    expect(selectPortfolio(mockState)).toEqual(mockState.portfolio);
  });

  test("should select crypto assets", () => {
    expect(selectCryptoAssets(mockState)).toEqual(mockState.crypto.assets);
  });

  test("should enrich portfolio with crypto asset details", () => {
    const enrichedPortfolio = selectEnrichedPortfolio(mockState);
    expect(enrichedPortfolio).toEqual([
      {
        id: "bitcoin",
        quantity: 2,
        name: "Bitcoin",
        symbol: "btc",
        current_price: 45000,
        image: "https://example.com/bitcoin.png",
        total_value: 90000,
      },
      {
        id: "ethereum",
        quantity: 5,
        name: "Ethereum",
        symbol: "eth",
        current_price: 3000,
        image: "https://example.com/ethereum.png",
        total_value: 15000,
      },
    ]);
  });

  test("should exclude assets that are not in crypto state", () => {
    mockState.portfolio.push({ id: "ripple", quantity: 10 });
    const enrichedPortfolio = selectEnrichedPortfolio(mockState);
    expect(enrichedPortfolio).toHaveLength(2); // Ripple should be excluded
  });
});
