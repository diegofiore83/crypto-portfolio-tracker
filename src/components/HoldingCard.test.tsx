import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import portfolioReducer from "../store/slices/portfolio-slice";
import { CryptoHolding } from "../store/types";
import HoldingCard from "./HoldingCard";
import { RootState } from "../store/store";

const mockProps = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  image: "https://example.com/bitcoin.png",
  quantity: 2,
  current_price: 50000,
  total_value: 100000,
};

describe("HoldingCard Component", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { portfolio: portfolioReducer },
      preloadedState: {
        portfolio: [{ id: "bitcoin", quantity: 2 } as CryptoHolding],
      },
    });
  });

  const renderWithProvider = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>
    );

  test("renders HoldingCard correctly (snapshot)", () => {
    const { asFragment } = renderWithProvider(<HoldingCard {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("displays correct initial data", () => {
    renderWithProvider(<HoldingCard {...mockProps} />);
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText(/\$50,000(\.00)?/)).toBeInTheDocument();
    expect(screen.getByText(/\$100,000(\.00)?/)).toBeInTheDocument();
  });

  test("opens edit mode and updates quantity", async () => {
    renderWithProvider(<HoldingCard {...mockProps} />);

    fireEvent.click(screen.getByText("Edit BTC"));
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const updatedState = (store.getState() as RootState).portfolio;
      expect(updatedState).toContainEqual({ id: "bitcoin", quantity: 3 });
    });
  });

  test("shows delete confirmation dialog", async () => {
    renderWithProvider(<HoldingCard {...mockProps} />);
    fireEvent.click(screen.getByText("Delete BTC"));

    await waitFor(() => {
      expect(
        screen.getByRole("dialog", { name: /delete bitcoin/i })
      ).toBeInTheDocument();
    });
  });

  test("deletes the holding when confirmed", async () => {
    renderWithProvider(<HoldingCard {...mockProps} />);

    fireEvent.click(screen.getByText("Delete BTC"));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      const updatedState = (store.getState() as RootState).portfolio;
      expect(updatedState).not.toContainEqual({ id: "bitcoin", quantity: 2 });
    });
  });
});
