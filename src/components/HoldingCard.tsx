import React, { useCallback, useState } from "react";
import {
  Box,
  Divider,
  Grid2 as Grid,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import CryptoQuantityField from "./HoldingCard/QuantityEditField";
import DeleteConfirmationDialog from "./HoldingCard/DeleteConfirmationDialog";
import { useAppDispatch } from "../store/hooks";
import { deleteCrypto, editCrypto } from "../store/slices/portfolio-slice";

interface HoldingCardProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  current_price: number;
  total_value: number;
}

const HoldingCard: React.FC<HoldingCardProps> = ({
  id,
  name,
  symbol,
  image,
  quantity,
  current_price,
  total_value,
}) => {
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [editedQuantity, setEditedQuantity] = useState<string>(
    quantity.toString()
  );
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const isValidQuantity =
    editedQuantity !== "" && parseFloat(editedQuantity) > 0;

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = useCallback(() => {
    dispatch(deleteCrypto(id));
    setShowDeleteConfirmation(false);
  }, [dispatch, id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const numValue = parseFloat(value);

    setEditedQuantity(value);
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
      dispatch(editCrypto({ id, quantity: parseFloat(editedQuantity) }));
      setEditedQuantity(editedQuantity);
      setIsEditingMode(false);
    }
  }, [dispatch, id, editedQuantity, isValidQuantity]);

  const handleCancel = useCallback(() => {
    setIsEditingMode(false);
    setEditedQuantity(quantity.toString());
    setError(null);
  }, [quantity]);

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
            </Box>
          }
          subheader={
            <Typography variant="subtitle2" noWrap maxWidth="90%">
              {name}
            </Typography>
          }
        />
        <CardContent>
          <Box minHeight={85}>
            {isEditingMode ? (
              <CryptoQuantityField
                editedQuantity={editedQuantity}
                error={error}
                handleQuantityChange={handleQuantityChange}
                handleSubmit={handleSubmit}
                isValidQuantity={isValidQuantity}
              />
            ) : (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography variant="body2" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {quantity.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 5,
                      useGrouping: true,
                    })}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography variant="body2" color="text.secondary">
                    Current Price
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    $
                    {current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 5,
                      useGrouping: true,
                    })}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="text.primary"
                  >
                    Total Value
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    $
                    {total_value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
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
                isEditingMode ? handleCancel() : setIsEditingMode(true)
              }
            >
              {isEditingMode ? "Cancel" : `Edit ${symbol.toUpperCase()}`}
            </Button>
            <Button size="small" color="error" onClick={handleDeleteClick}>
              Delete {symbol.toUpperCase()}
            </Button>
          </Box>
        </CardActions>
      </Card>

      <DeleteConfirmationDialog
        open={showDeleteConfirmation}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        name={name}
        symbol={symbol}
      />
    </Grid>
  );
};

export default HoldingCard;
