import React from "react";
import { Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Stack
      spacing={10}
      alignItems="center"
      justifyContent="center"
      height="70vh"
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 100 }} />
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Stack>
  );
};

export default Error;
