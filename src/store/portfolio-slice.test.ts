import portfolioReducer, {
  addCrypto,
  editCrypto,
  deleteCrypto,
} from "./portfolio-slice";
import { CryptoHolding } from "./types";

describe("portfolioSlice", () => {
  let initialState: CryptoHolding[];

  beforeEach(() => {
    initialState = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        quantity: 2,
        currentPrice: 60000,
        totalValue: 120000,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        quantity: 5,
        currentPrice: 4000,
        totalValue: 20000,
      },
    ];
  });

  test("should add a new crypto holding", () => {
    const newCrypto: CryptoHolding = {
      name: "Solana",
      symbol: "SOL",
      quantity: 10,
      currentPrice: 150,
      totalValue: 1500,
    };

    const newState = portfolioReducer(initialState, addCrypto(newCrypto));

    expect(newState).toHaveLength(3);
    expect(newState).toContainEqual(newCrypto);
  });

  test("should edit an existing crypto holding", () => {
    const updatedCrypto: CryptoHolding = {
      name: "Ethereum",
      symbol: "ETH",
      quantity: 10,
      currentPrice: 4500,
      totalValue: 45000,
    };

    const newState = portfolioReducer(initialState, editCrypto(updatedCrypto));

    expect(newState).toHaveLength(2);
    expect(newState.find((crypto) => crypto.symbol === "ETH")).toEqual(
      updatedCrypto
    );
  });

  test("should delete a crypto holding", () => {
    const newState = portfolioReducer(initialState, deleteCrypto("BTC"));

    expect(newState).toHaveLength(1);
    expect(newState.find((crypto) => crypto.symbol === "BTC")).toBeUndefined();
  });

  test("should not edit a non-existing crypto holding", () => {
    const updatedCrypto: CryptoHolding = {
      name: "Ripple",
      symbol: "XRP",
      quantity: 500,
      currentPrice: 1,
      totalValue: 500,
    };

    const newState = portfolioReducer(initialState, editCrypto(updatedCrypto));

    expect(newState).toHaveLength(2); // No change
  });

  test("should not delete a non-existing crypto holding", () => {
    const newState = portfolioReducer(initialState, deleteCrypto("XRP"));

    expect(newState).toHaveLength(2); // No change
  });
});

describe("portfolioSlice localStorage", () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
  });

  test("should store updated portfolio in local storage when adding crypto", () => {
    const newCrypto: CryptoHolding = {
      name: "Solana",
      symbol: "SOL",
      quantity: 10,
      currentPrice: 150,
      totalValue: 1500,
    };

    portfolioReducer([], addCrypto(newCrypto));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "portfolio",
      JSON.stringify([newCrypto])
    );
  });
});
