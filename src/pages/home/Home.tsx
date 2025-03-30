import React from "react";

import Hero from "../../components/hero/Hero";
import ProductCategories from "../../components/categories/product-categories/ProductCategories";
import Advertisement from "../../components/advertisement/Advertisement";
import OurBestSeller from "../../components/our-best-seller/OurBestSeller";
import NewIn from "../../components/new-in/NewIn";

import "./Home.scss";
import { useStore } from "../../store";
import HomeBlog from "../../components/our-blog/HomeBlog";

const Home: React.FC = () => {
  const token = useStore((state) => state.profile.user?.token);
  return (
    <>

      <div className="home-page">
        <Hero />
        <div className="section-container">
          <ProductCategories />
          <Advertisement />
          <OurBestSeller />
        </div>
        <NewIn />
        <div className="section-container">
          {/* <SpecialOffer /> */}
          {/* <OurBranch /> */}
          <HomeBlog />
        </div>
      </div>


    </>
  );
};

export default Home;
