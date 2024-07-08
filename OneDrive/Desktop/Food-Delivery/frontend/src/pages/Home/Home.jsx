import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";


const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <button className="go-top">
        <a href="/"><MdKeyboardDoubleArrowUp/></a>
      </button>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};

export default Home;
