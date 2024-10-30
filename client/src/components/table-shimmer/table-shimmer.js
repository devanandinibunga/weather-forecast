import React from "react";
import PropTypes from "prop-types";
import { ShimmerTable } from "react-shimmer-effects";

export const TableShimmer = ({ row, col }) => {
  return <ShimmerTable row={row} col={col} />;
};
TableShimmer.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
};
