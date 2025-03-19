import React from "react";

import Hero from "../../components/hero/Hero";
import ProductCategories from "../../components/categories/product-categories/ProductCategories";
import Advertisement from "../../components/advertisement/Advertisement";
import OurBestSeller from "../../components/our-best-seller/OurBestSeller";
// import SpecialOffer from "../../components/special-offer/SpecialOffer";
import OurBranch from "../../components/our-branch/OurBranch";
import OurBlog from "../../components/our-blog/OurBlog";
import NewIn from "../../components/new-in/NewIn";

import "./Home.scss";
import { useStore } from "../../store";

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
          <OurBranch />
          <OurBlog />
        </div>
      </div>


    </>
  );
};

export default Home;
