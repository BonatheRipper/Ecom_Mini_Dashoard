import React from "react";
import "./LoadinScreen.css";
import { useStateContext } from "../context/Statecontext";

import { useState } from "react";
import { CircleLoaderx, HashLoaderx, RingLoaderx } from "./Loaders";

const LoadingScreen = () => {
  const { themeBG, currentThemeLoader } = useStateContext();
  return (
    <div
      className={`w-full h-full ${themeBG} flex items-center z-50 fixed justify-center`}
    >
      {currentThemeLoader === "CircleLoader" && <CircleLoaderx size={40} />}
      {currentThemeLoader === "HashLoader" && <HashLoaderx size={40} />}
      {currentThemeLoader === "RingLoader" && <RingLoaderx size={40} />}
    </div>
  );
};

export default LoadingScreen;
