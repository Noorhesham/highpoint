"use client";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { CourseProps } from "../models/Course";

interface ExportCoursesToPDFProps {
  courses: CourseProps[];
}

const ExportCoursesToPDF: React.FC<ExportCoursesToPDFProps> = ({ courses }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20; // Y position starts here

    courses.forEach((course, index) => {
      if (index > 0) {
        doc.addPage(); // Add a new page for each course
        currentY = 20;
      }

      // 1. Add Header Title
      doc.setFontSize(18);
      doc.text("Course Details", pageWidth / 2, currentY, { align: "center" });

      // 2. Add Course Image (if exists)
      const imageUrl = course.images?.[0]?.secure_url; // Use first image if available
      if (imageUrl) {
        const imgWidth = 50;
        const imgHeight = 30;
        doc.addImage(imageUrl, "JPEG", 10, currentY + 10, imgWidth, imgHeight);
      }

      currentY += 50; // Adjust Y after image

      // 3. Add Course Information as Text
      doc.setFontSize(12);
      doc.text(`Course ID: ${course._id}`, 10, currentY);
      doc.text(`Name (EN): ${course.name.en}`, 10, currentY + 10);
      doc.text(`Name (AR): ${course.name.ar}`, 10, currentY + 20);
      doc.text(`Category: ${course.category}`, 10, currentY + 30);
      doc.text(`Price: $${course.price}`, 10, currentY + 40);
      doc.text(`Duration: ${course.duration} days`, 10, currentY + 50);
      doc.text(`Start Date: ${new Date(course.startDate).toLocaleDateString()}`, 10, currentY + 60);
      doc.text(`End Date: ${new Date(course.endDate).toLocaleDateString()}`, 10, currentY + 70);

      currentY += 90;

      // 4. Add Description Table
      autoTable(doc, {
        startY: currentY,
        head: [["Description (EN)", "Description (AR)"]],
        body: [[course.description.en, course.description.ar]],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
        headStyles: { fillColor: [22, 160, 133] }, // Green header
        columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } }, // Adjust table column widths
      });

      currentY = doc.lastAutoTable.finalY + 10; // Adjust to the last position of the table
    });

    // 5. Save PDF File
    doc.save("courses.pdf");
  };

  return <Button onClick={handleExport}>Export All Courses to PDF</Button>;
};

export default ExportCoursesToPDF;
