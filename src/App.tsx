import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./store/hooks";
import Header from "./components/Header";
import Error from "./components/Error";
import CryptoPage from "./pages/CryptoPage";
import PortfolioPage from "./pages/PortfolioPage";
import { fetchCryptoAssets } from "./store/slices/crypto-slice";
import theme from "./theme";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCryptoAssets()); // Fetch data on mount
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/crypto/:id" element={<CryptoPage />} />
            <Route path="*" element={<Error message="Page not found." />} />
          </Routes>
        </Container>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
