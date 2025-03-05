import { StrictMode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import "./index.css";
import theme from "./theme";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
