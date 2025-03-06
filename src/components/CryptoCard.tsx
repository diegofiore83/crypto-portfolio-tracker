import React, { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardActions,
  Grid2 as Grid,
  Button,
  TextField,
  Typography,
  Avatar,
  CardContent,
} from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { addCrypto } from "../store/slices/portfolio-slice";

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  price_change_percentage_24h: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  name,
  symbol,
  current_price,
  image,
  price_change_percentage_24h,
}) => {
  const dispatch = useAppDispatch();
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [quantity, setQuantity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isValidQuantity = quantity !== "" && parseFloat(quantity) > 0;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const numValue = parseFloat(value);

    setQuantity(value);
    setError(
      value === ""
        ? null
        : isNaN(numValue) || numValue <= 0
        ? "Quantity must be positive"
        : null
    );
  };

  const handleSubmit = useCallback(() => {
    if (isValidQuantity) {
      dispatch(addCrypto({ id, quantity: parseFloat(quantity) }));
      setQuantity("");
      setIsAddingMode(false);
    }
  }, [dispatch, id, quantity, isValidQuantity]);

  const handleCancel = useCallback(() => {
    setIsAddingMode(false);
    setQuantity("");
    setError(null);
  }, []);

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              alt={name}
              src={image}
              sx={{ width: 32, height: 32, mb: 1 }}
            />
          }
          title={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontWeight="bold">{symbol.toUpperCase()}</Typography>
              <Typography
                fontWeight="bold"
                color={price_change_percentage_24h > 0 ? "green" : "red"}
              >
                {price_change_percentage_24h > 0 && "+"}
                {price_change_percentage_24h.toFixed(2)}%
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="subtitle2" noWrap maxWidth="90%">
              {name}
            </Typography>
          }
        />
        {isAddingMode && (
          <CardContent>
            <Box display="flex" gap={2} alignItems="flex-start">
              <TextField
                label="Quantity"
                size="small"
                type="number"
                value={quantity}
                onKeyDown={(e) =>
                  e.key === "Enter" && isValidQuantity && handleSubmit()
                }
                onChange={handleQuantityChange}
                error={!!error}
                helperText={error}
                sx={{ flexGrow: 1, paddingBottom: error ? 0 : 6 }}
              />
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!isValidQuantity}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        )}
        <CardActions>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingRight={2}
          >
            <Button
              size="small"
              color="primary"
              onClick={() =>
                isAddingMode ? handleCancel() : setIsAddingMode(true)
              }
            >
              {isAddingMode ? "Cancel" : `Add ${symbol.toUpperCase()}`}
            </Button>
            <Typography fontWeight="bold">
              $
              {current_price.toLocaleString(undefined, {
                minimumFractionDigits: current_price < 1 ? 5 : 2,
                maximumFractionDigits: 8,
                useGrouping: true,
              })}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CryptoCard;
