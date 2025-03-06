import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "center" }}>
          <Typography
            variant="h5"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
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
