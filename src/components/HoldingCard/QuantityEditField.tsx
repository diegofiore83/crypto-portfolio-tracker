import React from "react";
import { Box, Button, TextField } from "@mui/material";

interface QuantityEditFieldProps {
  editedQuantity: string;
  error: string | null;
  handleQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isValidQuantity: boolean;
}

const QuantityEditField: React.FC<QuantityEditFieldProps> = ({
  editedQuantity,
  error,
  handleQuantityChange,
  handleSubmit,
  isValidQuantity,
}) => (
  <Box display="flex" gap={2} alignItems="flex-start">
    <TextField
      label="Quantity"
      size="small"
      type="number"
      value={editedQuantity}
      onChange={handleQuantityChange}
      onKeyDown={(e) => e.key === "Enter" && isValidQuantity && handleSubmit()}
      error={!!error}
      helperText={error}
      sx={{ flexGrow: 1 }}
    />
    <Button
      color="primary"
      variant="contained"
      onClick={handleSubmit}
      disabled={!isValidQuantity}
    >
      Save
    </Button>
  </Box>
);

export default QuantityEditField;
