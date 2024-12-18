"use client"; // Client-side component
import React, { useRef } from "react";
import { convertToHTML } from "../utils/fn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const html2pdf = dynamic(() => import("html2pdf.js"), {
  ssr: false,
});
const ExportCoursesToPDF = ({ courses }) => {
  const pdfContentRef = useRef();

  // Function to generate and download the PDF
  const generatePDF = () => {
    const content = pdfContentRef.current;

    // Clone the content for PDF generation (without showing the original content)
    const clonedContent = content.cloneNode(true);

    // You can make some adjustments to the cloned content if needed, like styling
    clonedContent.style.visibility = "visible"; // Keep it hidden in the DOM
    clonedContent.style.display = "block"; // Make it visible in the PDF

    const options = {
      margin: 10,
      filename: "courses.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        autoPaging: true,
      },
    };

    // Generate the PDF and save it
    html2pdf().from(clonedContent).set(options).save();
  };

  return (
    <div>
      {/* PDF content - hidden in browser view */}
      <div
        ref={pdfContentRef}
        style={{
          fontFamily: "'Cairo', Arial, sans-serif",
          padding: "20px",
          direction: "rtl",
          textAlign: "right",
          display: "none", // Start with content hidden
        }}
      >
        {courses.map((course, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            {/* Header Section */}
            <header style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "24px", margin: 0 }}>{course.name.en}</h1>
              <h2 style={{ fontSize: "20px", color: "#888" }}>{course.name.ar}</h2>
            </header>

            {/* Description Section */}
            <section>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>الوصف</h3>
              <div>
                <div
                  style={{ textAlign: "left", direction: "ltr" }}
                  dangerouslySetInnerHTML={{
                    __html: convertToHTML(course.description.en || ""),
                  }}
                />
                <div
                  style={{ textAlign: "right", marginTop: "10px" }}
                  dangerouslySetInnerHTML={{
                    __html: convertToHTML(course.description.ar || ""),
                  }}
                />
              </div>
            </section>

            {/* Course Details */}
            <section style={{ marginTop: "20px" }}>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>تفاصيل الدورة</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                  direction: "ltr",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>المدة</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{course.duration} hours</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>السعر</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>${course.price}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>رقم التسلسل</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{course.serialNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>تاريخ البدء</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(course.startDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>تاريخ الانتهاء</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(course.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Images Section */}
            <section style={{ marginTop: "20px" }}>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>الصور</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {course.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.secure_url}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "200px",
                      height: "auto",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </div>
            </section>
          </div>
        ))}
      </div>

      {/* Button to trigger PDF generation */}
      <Button onClick={generatePDF}>Convert All To Pdf</Button>
    </div>
  );
};

export default ExportCoursesToPDF;
