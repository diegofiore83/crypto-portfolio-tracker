import portfolioReducer, {
  addCrypto,
  editCrypto,
  deleteCrypto,
} from "./portfolio-slice";
import { CryptoHolding } from "../types";

describe("portfolioSlice", () => {
  let initialState: CryptoHolding[];

  beforeEach(() => {
    initialState = [
      {
        id: "bitcoin",
        quantity: 2,
      },
      {
        id: "ethereum",
        quantity: 5,
      },
    ];
  });

  test("should add a new crypto holding", () => {
    const newCrypto: CryptoHolding = {
      id: "solana",
      quantity: 10,
    };

    const newState = portfolioReducer(initialState, addCrypto(newCrypto));

    expect(newState).toHaveLength(3);
    expect(newState).toContainEqual(newCrypto);
  });

  test("should edit an existing crypto holding", () => {
    const updatedCrypto: CryptoHolding = {
      id: "ethereum",
      quantity: 10,
    };

    const newState = portfolioReducer(initialState, editCrypto(updatedCrypto));

    expect(newState).toHaveLength(2);
    expect(newState.find((crypto) => crypto.id === "ethereum")).toEqual(
      updatedCrypto
    );
  });

  test("should delete a crypto holding", () => {
    const newState = portfolioReducer(initialState, deleteCrypto("bitcoin"));

    expect(newState).toHaveLength(1);
    expect(newState.find((crypto) => crypto.id === "bitcoin")).toBeUndefined();
  });

  test("should not edit a non-existing crypto holding", () => {
    const updatedCrypto: CryptoHolding = {
      id: "ripple",
      quantity: 500,
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
      id: "solana",
      quantity: 10,
    };

    portfolioReducer([], addCrypto(newCrypto));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "portfolio",
      JSON.stringify([newCrypto])
    );
  });
});
