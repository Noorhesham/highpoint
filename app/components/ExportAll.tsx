"use client"; // Client-side component
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { convertToHTML } from "../utils/fn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ExportCoursesToPDF = ({ courses, isArabic = false }) => {
  const pdfContentRef = useRef();
  const t = useTranslations();

  // Function to generate and download the PDF
  const generatePDF = () => {
    const content = pdfContentRef.current;
    if (!content) return;

    // Clone the content for PDF generation
    const clonedContent = content.cloneNode(true);
    clonedContent.style.visibility = "visible";
    clonedContent.style.display = "block";

    const options = {
      margin: 10,
      filename: "courses.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

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
          direction: isArabic ? "rtl" : "ltr",
          textAlign: isArabic ? "right" : "left",
          display: "none",
        }}
      >
        {courses.map((course, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            <header style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "24px", margin: 0 }}>{isArabic ? course.name?.ar : course.name?.en}</h1>
            </header>

            <section>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
                {isArabic ? "الوصف" : "Description"}
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertToHTML(isArabic ? course.description?.ar || "" : course.description?.en || ""),
                }}
              />
            </section>

            <section style={{ marginTop: "20px" }}>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
                {isArabic ? "تفاصيل الدورة" : "Course Details"}
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{isArabic ? "المدة" : "Duration"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{course.duration} hours</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{isArabic ? "السعر" : "Price"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>${course.price}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {isArabic ? "تاريخ البدء" : "Start Date"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(course.startDate).toLocaleDateString(isArabic ? "ar-EG" : "en-GB")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {isArabic ? "تاريخ الانتهاء" : "End Date"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(course.endDate).toLocaleDateString(isArabic ? "ar-EG" : "en-GB")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section style={{ marginTop: "20px" }}>
              <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>{isArabic ? "الصور" : "Images"}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {course?.images?.map((img, index) => (
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

      <Button onClick={generatePDF}>{isArabic ? "تحويل الكل إلى PDF" : "Convert All To PDF"}</Button>
    </div>
  );
};

export default ExportCoursesToPDF;
