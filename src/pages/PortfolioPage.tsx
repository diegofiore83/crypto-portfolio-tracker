import React, { useEffect } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
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

      <Grid container spacing={2}>
        {Object.values(assets)
          .filter((item) => item !== null)
          .map((item) => (
            <CryptoCard key={item.id} {...item} />
          ))}
      </Grid>
    </div>
  );
};

export default PortfolioPage;
