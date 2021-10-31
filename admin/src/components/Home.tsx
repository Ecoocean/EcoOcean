import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import UsersTable from "./UsersTable";
import { Helmet } from "react-helmet";
const Home = () => {
  return (
    <main>
      <Helmet>
        <title>EcoOcean</title>
      </Helmet>
      <Header />
      <UsersTable />
      <Footer />
    </main>
  );
};

export default Home;
