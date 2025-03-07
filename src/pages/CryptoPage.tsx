import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { Box, Button, Typography, Avatar } from "@mui/material";
import Error from "../components/Error";
import Loading from "../components/Loading";
import HistoricChart from "../components/HistoricChart";

const CryptoPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const cryptoData = useAppSelector((state: RootState) =>
    id ? state.crypto.assets[id] : undefined
  );
  const status = useAppSelector((state: RootState) => state.crypto.status);

  // Use useMemo() to prevent returning a new object every time.
  const selectedData = useMemo(
    () => ({ crypto: cryptoData, status }),
    [cryptoData, status]
  );

  if (status === "loading") {
    return <Loading message="Loading cryptocurrency data..." />;
  }

  if (status === "failed") {
    return <Error message="Failed to load cryptocurrency data." />;
  }

  if (!selectedData.crypto) {
    return <Error message="Crypto not found." />;
  }

  return (
    <Box textAlign="center" p={4}>
      <Avatar
        src={selectedData.crypto.image}
        alt={selectedData.crypto.name}
        sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
      />
      <Typography variant="h4" fontWeight="bold">
        {selectedData.crypto.name} ({selectedData.crypto.symbol.toUpperCase()})
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Current Price: ${selectedData.crypto.current_price.toLocaleString()}
      </Typography>
      <Typography
        variant="body1"
        color={
          selectedData.crypto.price_change_percentage_24h > 0 ? "green" : "red"
        }
      >
        {selectedData.crypto.price_change_percentage_24h > 0 ? "+" : ""}
        {selectedData.crypto.price_change_percentage_24h.toFixed(2)}% (24h)
      </Typography>

      <HistoricChart
        id={selectedData.crypto.id}
        name={selectedData.crypto.name}
      />

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default CryptoPage;
