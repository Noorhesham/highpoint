import React from "react";
import "../loading.css";
const Spinner = ({ className, full = true }: { className?: string; full?: boolean }) => {
  return (
    <span
      className={`loader  z-40   ${
        className || "left-1/2   border-[5px] border-[#3a4f91] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 "
      }`}
    ></span>
  );
};

export default Spinner;
