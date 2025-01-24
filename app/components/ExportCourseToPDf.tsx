import React from "react";
import { Button } from "@/components/ui/button";
import { generateSingleCoursePDF } from "../utils/fn";

const ExportCoursesToPDF = ({ courses, logoURL }) => {
  const footerText =
    "00971566356223 : Mobile | info@europeanqualitytc.com | https://europeanqualitytc.com/en | U.A.E | 4422 : P.O.BOX";

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => generateSingleCoursePDF(courses, 1, logoURL, footerText)}>Export Without Prices</Button>
      <Button onClick={() => generateSingleCoursePDF(courses, 2, logoURL, footerText)}>Export Without Cities</Button>
      <Button onClick={() => generateSingleCoursePDF(courses, 3, logoURL, footerText)}>Export All Data</Button>
    </div>
  );
};

export default ExportCoursesToPDF;
