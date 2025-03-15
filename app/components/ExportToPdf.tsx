"use client"; // Client-side component
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { convertToHTML } from "../utils/fn";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ExportCoursesToPDF = ({ courses, isArabic = false }) => {
  const pdfContentRef = useRef();
  const t = useTranslations();

  // Function to generate and download the PDF
  const generatePDF = () => {
    const content = pdfContentRef.current;
    if (!content) return;

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
      {/* Hidden content for PDF generation */}
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
        {courses.map((course, index) => {
          // Split days into two parts
          const days = course?.days || [];
          const half = Math.ceil(days.length / 2);
          const firstHalfDays = days.slice(0, half);
          const secondHalfDays = days.slice(half);

          // Split long descriptions
          const descriptionHTML = convertToHTML(isArabic ? course?.description?.ar : course?.description?.en) || "";
          const threshold = 1000;
          const mid = Math.floor(descriptionHTML.length / 2);
          const firstHalfDescription = descriptionHTML.slice(0, mid);
          const secondHalfDescription = descriptionHTML.slice(mid);

          return (
            <div key={index} style={{ pageBreakAfter: "always" }}>
              <header style={{ textAlign: "center", marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", margin: 0 }}>{isArabic ? course.name?.ar : course.name?.en}</h1>
              </header>

              {/* Course Description with Splitting */}
              <section>
                <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
                  {isArabic ? "الوصف" : "Description"}
                </h3>
                {descriptionHTML.length < threshold ? (
                  <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                ) : (
                  <>
                    <div className="page-break" dangerouslySetInnerHTML={{ __html: firstHalfDescription }} />
                    <div className="page-break" dangerouslySetInnerHTML={{ __html: secondHalfDescription }} />
                  </>
                )}
              </section>

              {/* Course Days List with Splitting */}
              {days.length > 0 && (
                <>
                  <section style={{ marginTop: "20px" }}>
                    <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
                      {isArabic ? "الأيام" : "Days"}
                    </h3>
                    <ul style={{ textAlign: isArabic ? "right" : "left" }}>
                      {firstHalfDays.map((day, idx) => (
                        <li key={idx}>{isArabic ? day.ar : day.en}</li>
                      ))}
                    </ul>
                  </section>

                  {secondHalfDays.length > 0 && (
                    <div className="page-break">
                      <ul style={{ textAlign: isArabic ? "right" : "left" }}>
                        {secondHalfDays.map((day, idx) => (
                          <li key={idx + half}>{isArabic ? day.ar : day.en}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Course Details */}
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

              {/* Course Images */}
              {course.images?.length > 0 && (
                <section style={{ marginTop: "20px" }}>
                  <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
                    {isArabic ? "الصور" : "Images"}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {course.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img.secure_url}
                        alt={`Image ${imgIdx + 1}`}
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
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={generatePDF}>{isArabic ? "تحويل الكل إلى PDF" : "Convert All To PDF"}</Button>
    </div>
  );
};

export default ExportCoursesToPDF;
