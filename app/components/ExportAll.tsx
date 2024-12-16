"use client";
import React from "react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

interface ExportCoursesToPDFProps {
  courses: any[]; // Array of course objects
}

const ExportCoursesToPDF: React.FC<ExportCoursesToPDFProps> = ({ courses }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    courses.forEach((course, index) => {
      if (index > 0) doc.addPage();

      doc.text(`Course ID: ${course._id}`, 10, 20);
      doc.text(`Name (EN): ${course.name.en}`, 10, 30);
      doc.text(`Name (AR): ${course.name.ar}`, 10, 40);
      doc.text(`Category: ${course.category}`, 10, 50);
      doc.text(`Price: ${course.price}`, 10, 60);
      doc.text(`Duration: ${course.duration}`, 10, 70);
      doc.text(`Start Date: ${course.startDate}`, 10, 80);
      doc.text(`End Date: ${course.endDate}`, 10, 90);
    });

    doc.save("courses.pdf");
  };

  return <Button onClick={handleExport}>Export All Courses to PDF</Button>;
};

export default ExportCoursesToPDF;
