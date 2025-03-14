import React, { useEffect, useMemo, useState } from "react";
import { Grid2 as Grid, TextField, Typography } from "@mui/material";
import CryptoCard from "../components/CryptoCard";
import HoldingCard from "../components/HoldingCard";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { selectEnrichedPortfolio } from "../store/selectors/portfolio-selectors";

const PortfolioPage: React.FC = () => {
  const enrichedPortfolio = useAppSelector(selectEnrichedPortfolio);
  const { assets, status } = useAppSelector((state: RootState) => state.crypto);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredAssets = useMemo(() => {
    if (!debouncedQuery) return Object.values(assets);
    return Object.values(assets).filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, assets]);

  useEffect(() => {
    if (enrichedPortfolio.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [enrichedPortfolio]);

  if (status === "loading") {
    return <Loading message="Loading your portfolio and crypto assets..." />;
  }

  if (status === "failed") {
    return <Error message="We couldn't load the cryptocurrency data." />;
  }

  return (
    <div>
      <Typography variant="h6" marginY={4}>
        Your Holdings
      </Typography>
      {enrichedPortfolio.length === 0 && (
        <Typography variant="body1" marginBottom={2}>
          You can add more cryptocurrencies to your portfolio by clicking on the
          cards below.
        </Typography>
      )}
      <Grid container spacing={2}>
        {enrichedPortfolio
          .filter((item) => item !== null)
          .map((item) => (
            <HoldingCard key={item.id} {...item}></HoldingCard>
          ))}
      </Grid>

      <Typography variant="h6" marginY={4}>
        Add More Cryptos
      </Typography>

      <TextField
        label="Search Cryptocurrencies"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Grid container spacing={2}>
        {filteredAssets.map((item) => (
          <CryptoCard key={item.id} {...item} />
        ))}
      </Grid>
    </div>
  );
};

export default PortfolioPage;
