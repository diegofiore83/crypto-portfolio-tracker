import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading Component", () => {
  test("renders loading message correctly", () => {
    const loadingMessage = "Fetching data...";

    render(<Loading message={loadingMessage} />);

    // Check if the loading message appears
    expect(screen.getByText(loadingMessage)).toBeInTheDocument();
  });

  test("renders CircularProgress spinner", () => {
    render(<Loading message="Loading test" />);

    // ✅ Look for the progress indicator using role
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
