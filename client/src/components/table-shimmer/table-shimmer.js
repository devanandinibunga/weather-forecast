import React from "react";
import { ShimmerTable } from "react-shimmer-effects";

export const TableShimmer = ({ row, col }) => {
  const defaultRow = row || 5;
  const defaultCol = col || 5;

  return <ShimmerTable row={defaultRow} col={defaultCol} />;
};
