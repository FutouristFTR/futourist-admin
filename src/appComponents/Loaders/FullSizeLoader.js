import React from "react";

const logo = require("assets/img/logo.svg");

const FullSizeLoader = () => (
  <div className="fullSizeLoader full">
    <img className="logo" src={logo} alt="Futourist logo" />
    <div className="loader9" />
  </div>
);

export default FullSizeLoader;
