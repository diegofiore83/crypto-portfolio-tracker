import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "./Loading";
import Error from "./Error";
import CryptoService from "../services/crypto-service";
import { MarketData } from "../store/types";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricChartProps {
  id: string;
  name: string;
}

const HistoricChart: React.FC<HistoricChartProps> = ({ id, name }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<ChartJS<"line"> | null>(null); // Reference to chart instance
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!id) return;

    // Cancel the previous request before making a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    const fetchMarketData = async () => {
      try {
        const data = await CryptoService.getCryptoHistory(
          id,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setMarketData(data);
          setError(null);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          console.warn(`Request aborted: ${id}`);
        } else {
          setError("Failed to load historical data.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMarketData();

    return () => {
      controller.abort(); // Cleanup: Abort request on unmount

      // Copy chart instance to a local variable before cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const chartInstance = chartRef.current;
      if (chartInstance) {
        chartInstance.destroy(); // Destroy chart instance safely
      }
    };
  }, [id]);

  return (
    <Box mt={3}>
      {loading && (
        <Loading message={`Loading ${name} last 30 days chart ...`} />
      )}

      {error && <Error message={error} />}

      {marketData && !loading && (
        <>
          <Typography variant="h6">
            Market history for the last month
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <Line
              ref={chartRef}
              data={{
                labels: marketData.prices.map(([timestamp]) =>
                  new Date(timestamp).toLocaleDateString("DD/MM/YYYY")
                ),
                datasets: [
                  {
                    data: marketData.prices.map(([, price]) => price),
                    label: "Price (Past 31 Days) in USD",
                    borderColor: "#EEBC1D",
                    tension: 0.2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                  point: {
                    radius: 1,
                  },
                },
                scales: {
                  x: { type: "category" },
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default HistoricChart;
