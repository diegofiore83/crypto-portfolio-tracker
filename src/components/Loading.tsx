import React from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

const Loading: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Stack
      spacing={8}
      alignItems="center"
      justifyContent="center"
      height="70vh"
    >
      <CircularProgress size="4rem" />
      <Typography
        variant="body1"
        gutterBottom
        fontWeight="bold"
        color="text.primary"
      >
        {message}
      </Typography>
    </Stack>
  );
};

export default Loading;
