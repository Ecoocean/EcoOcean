import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MapContainer from "./map/MapContainer";
import { Helmet } from "react-helmet";
const Home = () => {
  return (
    <main>
      <Helmet>
        <title>EcoOcean</title>
      </Helmet>
      <Header />
      <MapContainer />
      <Footer />
    </main>
  );
};

export default Home;
