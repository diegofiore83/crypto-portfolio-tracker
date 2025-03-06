import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
  test("renders header with correct title", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Crypto Portfolio Tracker")).toBeInTheDocument();
  });

  test("navigates to home page when clicking the title", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Header />
      </Router>
    );

    fireEvent.click(screen.getByText("Crypto Portfolio Tracker"));

    expect(history.location.pathname).toBe("/");
  });
});
