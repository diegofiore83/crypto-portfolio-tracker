import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { Box, Button, Typography, Avatar } from "@mui/material";
import Error from "../components/Error";

const CryptoPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // ✅ Mark `id` as optional
  const crypto = useAppSelector((state: RootState) =>
    id ? state.crypto.assets[id] : undefined
  );
  const navigate = useNavigate();

  if (!crypto) {
    return <Error message="Crypto not found." />;
  }

  return (
    <Box textAlign="center" p={4}>
      <Avatar
        src={crypto.image}
        alt={crypto.name}
        sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
      />
      <Typography variant="h4" fontWeight="bold">
        {crypto.name} ({crypto.symbol.toUpperCase()})
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Current Price: ${crypto.current_price.toLocaleString()}
      </Typography>
      <Typography
        variant="body1"
        color={crypto.price_change_percentage_24h > 0 ? "green" : "red"}
      >
        {crypto.price_change_percentage_24h > 0 ? "+" : ""}
        {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default CryptoPage;
