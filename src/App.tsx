import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CoinsPage from "./pages/CoinPage";
import "@/App.css";

const App = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#14161A",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Montserrat",
      }}
    >
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/coins/:id" element={<CoinsPage />} />
            <Route path="*" element={<div>Not found</div>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Box>
  );
};

export default App;
