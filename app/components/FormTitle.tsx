import React from "react";

const FormTitle = ({ text, className }: { text: string; className?: string }) => {
  return <h3 className={`text-base w-full text-gray-100 py-3 px-6 rounded-2xl font-semibold bg-main/60 my-5 ${className || ""}`}>{text}</h3>;
};

export default FormTitle;
