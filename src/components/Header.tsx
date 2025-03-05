import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent">
      <Container>
        <Toolbar>
          <Typography
            onClick={() => navigate("/")}
            sx={{
              flex: 1,
              color: "gold",
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          >
            Crypto Portfolio Tracker
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
