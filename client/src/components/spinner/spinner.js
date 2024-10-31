import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <FaSpinner className="spinner" size={40} color="#3498db" />
    </div>
  );
};

export default Spinner;
