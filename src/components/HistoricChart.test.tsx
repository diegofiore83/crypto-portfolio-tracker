import { act } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import HistoricChart from "../components/HistoricChart";
import CryptoService from "../services/crypto-service";

jest.mock("../services/crypto-service", () => ({
  getCryptoHistory: jest.fn(),
}));

const mockMarketData = {
  prices: [
    [1710633600000, 50000],
    [1710720000000, 50500],
    [1710806400000, 49800],
  ],
};

describe("HistoricChart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("displays loading state while fetching data", async () => {
    (CryptoService.getCryptoHistory as jest.Mock).mockImplementation(
      () => new Promise(() => null)
    );

    render(<HistoricChart id="bitcoin" name="Bitcoin" />);

    expect(
      screen.getByText(/Loading Bitcoin last 30 days chart/i)
    ).toBeInTheDocument();
  });

  test("displays error message if API call fails", async () => {
    (CryptoService.getCryptoHistory as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<HistoricChart id="bitcoin" name="Bitcoin" />);

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load historical data/i)
      ).toBeInTheDocument()
    );
  });

  test("aborts request on unmount", async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, "abort");

    (CryptoService.getCryptoHistory as jest.Mock).mockResolvedValue(
      mockMarketData
    );

    const { unmount } = render(<HistoricChart id="bitcoin" name="Bitcoin" />);

    act(() => {
      unmount(); // Unmount the component
    });

    expect(abortSpy).toHaveBeenCalled();
  });
});
