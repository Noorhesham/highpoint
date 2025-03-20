"use client"; // Client-side component
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { convertToHTML } from "../utils/fn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getGenralSettings } from "../queries";
import { MdEmail } from "react-icons/md";
import { PhoneIcon } from "lucide-react";

const ExportCoursesToPDF = ({ courses, isArabic = false }) => {
  const pdfContentRef = useRef();
  const t = useTranslations();
  const { data, isLoading } = getGenralSettings();

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

  const styles = {
    container: {
      fontFamily: "'Times New Roman', serif",
      padding: "40px 60px",
      direction: isArabic ? "rtl" : "ltr",
      textAlign: isArabic ? "right" : "left",
      display: "none",
      maxWidth: "800px",
      margin: "0 auto",
      lineHeight: "1.6",
      backgroundColor: "#fff",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
      borderBottom: "2px solid #2B4B8C",
      paddingBottom: "20px",
    },
    courseTitle: {
      fontSize: "28px",
      color: "#2B4B8C",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#666",
      fontStyle: "italic",
    },
    sectionTitle: {
      fontSize: "20px",
      color: "#2B4B8C",
      borderBottom: "1px solid #2B4B8C",
      paddingBottom: "8px",
      marginTop: "30px",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    introduction: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderLeft: "4px solid #2B4B8C",
      marginBottom: "30px",
    },
    list: {
      listStyleType: "none",
      paddingLeft: "0",
      marginBottom: "20px",
    },
    listItem: {
      fontSize: "14px",
      color: "#333",
      marginBottom: "12px",
      paddingLeft: "20px",
      position: "relative",
      lineHeight: "1.6",
    },
    bullet: {
      position: "absolute",
      left: "0",
      color: "#2B4B8C",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      marginBottom: "30px",
      fontSize: "14px",
    },
    tableCell: {
      padding: "12px 15px",
      border: "1px solid #dee2e6",
      color: "#333",
    },
    tableCellHeader: {
      backgroundColor: "#f8f9fa",
      fontWeight: "bold",
      color: "#2B4B8C",
      width: "30%",
    },
  };

  return (
    <div>
      <div ref={pdfContentRef} style={styles.container}>
        {" "}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={!isLoading && !data ? "/photo_2024-12-03_13-07-38-removebg-preview.png" : data?.data.logo}
            alt="logo"
            className=" mx-auto self-center"
            style={{ width: "150px", height: "auto", marginBottom: "20px" }}
          />
        </div>
        {courses.map((course, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            <header style={styles.header}>
              <h1 style={styles.courseTitle}>{isArabic ? course.name?.ar : course.name?.en}</h1>
            </header>

            <section>
              <h3 style={styles.sectionTitle}>{isArabic ? "الوصف" : "Description"}</h3>
              <div style={styles.introduction}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: convertToHTML(isArabic ? course.description?.ar || "" : course.description?.en || ""),
                  }}
                />
              </div>
            </section>

            <section style={{ marginTop: "20px" }}>
              <h3 style={styles.sectionTitle}>{isArabic ? "تفاصيل الدورة" : "Course Details"}</h3>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                      {isArabic ? "المدة" : "Duration"}
                    </td>
                    <td style={styles.tableCell}>{course.duration} hours</td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.tableCell, ...styles.tableCellHeader }}>{isArabic ? "السعر" : "Price"}</td>
                    <td style={styles.tableCell}>${course.price}</td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                      {isArabic ? "تاريخ البدء" : "Start Date"}
                    </td>
                    <td style={styles.tableCell}>
                      {new Date(course.startDate).toLocaleDateString(isArabic ? "ar-EG" : "en-GB")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                      {isArabic ? "تاريخ الانتهاء" : "End Date"}
                    </td>
                    <td style={styles.tableCell}>
                      {new Date(course.endDate).toLocaleDateString(isArabic ? "ar-EG" : "en-GB")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section style={{ marginTop: "20px" }}>
              <h3 style={styles.sectionTitle}>{isArabic ? "الصور" : "Images"}</h3>
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
        ))}{" "}
        <footer
          style={{
            fontFamily: "'Times New Roman', serif",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderTop: "2px solid #2B4B8C",
            textAlign: isArabic ? "right" : "left",
            direction: isArabic ? "rtl" : "ltr",
            marginTop: "40px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <PhoneIcon className="w-5 h-5" />
              <span>00971566356223 : Mobile | 00971563356098 : Mobile | 00971566356223 : Phone</span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <MdEmail className="w-5 h-5" />
              <span>
                <a href="mailto:info@highpointtc.com">info@highpointtc.com</a>
              </span>
            </div>
            <div>
              <span>U.A.E </span>
            </div>
            <div>
              <a href="https://highpointtc.com/en">https://highpointtc.com/en</a>
            </div>
          </div>
        </footer>
      </div>

      <Button onClick={generatePDF}>{isArabic ? "تحويل الكل إلى PDF" : "Convert All To PDF"}</Button>
    </div>
  );
};

export default ExportCoursesToPDF;
