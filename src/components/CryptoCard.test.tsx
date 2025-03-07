import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import portfolioReducer from "../store/slices/portfolio-slice";
import CryptoCard from "./CryptoCard";
import { RootState } from "../store/store";
import { addCrypto } from "../store/slices/portfolio-slice";

// Mock Props
const mockProps = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  current_price: 50000,
  image: "https://example.com/bitcoin.png",
  price_change_percentage_24h: 2.5,
};

describe("CryptoCard Component", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { portfolio: portfolioReducer },
      preloadedState: { portfolio: [] },
    });
  });

  const renderWithProvider = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>
    );

  test("renders CryptoCard correctly (snapshot)", () => {
    const { asFragment } = renderWithProvider(<CryptoCard {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("displays correct initial data", () => {
    renderWithProvider(<CryptoCard {...mockProps} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("+2.50%")).toBeInTheDocument();
    expect(screen.getByText(/\$50,000(\.00)?/)).toBeInTheDocument();
  });

  test("toggles add mode when clicking the add button", () => {
    renderWithProvider(<CryptoCard {...mockProps} />);

    // Click Add Button
    fireEvent.click(screen.getByText("Add BTC"));
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument(); // Input should appear

    // Click Cancel Button
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByLabelText("Quantity")).not.toBeInTheDocument(); // Input should disappear
  });

  test("shows error for invalid quantity input", () => {
    renderWithProvider(<CryptoCard {...mockProps} />);
    fireEvent.click(screen.getByText("Add BTC"));

    const input = screen.getByLabelText("Quantity");

    fireEvent.change(input, { target: { value: "-1" } });
    expect(screen.getByText("Quantity must be positive")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "0" } });
    expect(screen.getByText("Quantity must be positive")).toBeInTheDocument();
  });

  test("adds crypto to portfolio when valid quantity is submitted", async () => {
    renderWithProvider(<CryptoCard {...mockProps} />);
    fireEvent.click(screen.getByText("Add BTC"));

    const input = screen.getByLabelText("Quantity");
    fireEvent.change(input, { target: { value: "2" } });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      const updatedState = (store.getState() as RootState).portfolio;
      expect(updatedState).toContainEqual({ id: "bitcoin", quantity: 2 });
    });
  });

  test("dispatches addCrypto action when submitting valid quantity", async () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    renderWithProvider(<CryptoCard {...mockProps} />);
    fireEvent.click(screen.getByText("Add BTC"));

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        addCrypto({ id: "bitcoin", quantity: 3 })
      );
    });
  });
});
