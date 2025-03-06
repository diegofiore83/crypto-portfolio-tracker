import { render, screen } from "@testing-library/react";
import Error from "./Error";

describe("Error Component", () => {
  test("renders error message correctly", () => {
    const errorMessage = "Network error occurred";

    render(<Error message={errorMessage} />);

    // Check static text
    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();

    // Check dynamic error message
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("renders error icon", () => {
    render(<Error message="Test error" />);

    // Check if the ErrorOutlineIcon is in the document
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  });
});
