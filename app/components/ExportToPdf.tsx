"use client"; // Client-side component
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import html2pdf from "html2pdf.js";
import { convertToHTML, getDayOrdinal } from "../utils/fn";
import Image from "next/image";
import Logo from "./Logo";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getGenralSettings } from "../queries";
import { MdEmail } from "react-icons/md";
import { PhoneIcon } from "lucide-react";

const ExportToPdf = ({
  course,
  btn,
  type = "withputPrice",
  isArabic = false,
}: {
  course: any;
  btn?: boolean;
  type?: "withoutPrice" | "withoutCity" | "all";
  isArabic?: boolean;
}) => {
  const { data, isLoading } = getGenralSettings();

  const pdfContentRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    const content = pdfContentRef.current;
    if (!content) return;

    const clonedContent = content.cloneNode(true) as HTMLElement;
    clonedContent.style.visibility = "visible";
    clonedContent.style.display = "block";

    const options = {
      margin: 10,
      filename: `${course?.name?.en}_Course.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(clonedContent).set(options).save();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };
  const t = useTranslations();
  const days = course?.days || [];
  const half = Math.ceil(days.length / 2);
  const firstHalfDays = days.slice(0, half);
  const secondHalfDays = days.slice(half);

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
        <div style={{ marginTop: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={!isLoading && !data ? "/photo_2024-12-03_13-07-38-removebg-preview.png" : data?.data.logo}
              alt="logo"
              className=" mx-auto self-center"
              style={{ width: "150px", height: "auto", marginBottom: "20px" }}
            />
          </div>
          <h3 style={styles.sectionTitle}>{isArabic ? t("subCategoriesAr") : t("subCategoriesEn")}</h3>
          <ul style={styles.list}>
            {course?.subCategories?.map((sub: any) => (
              <li key={sub._id} style={styles.listItem}>
                <span style={styles.bullet}>•</span>
                <p>{isArabic ? sub.name.ar : sub.name.en}</p>
              </li>
            ))}
          </ul>
          <h3 style={styles.sectionTitle}>{isArabic ? t("daysAr") : t("daysEn")}</h3>
          <>
            <div className="page-break">
              <ul style={styles.list}>
                {firstHalfDays.map((day: any, index: number) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span>
                    {isArabic
                      ? `${getDayOrdinal(index, "ar")} ${index + 1} :`
                      : `${getDayOrdinal(index, "en")} ${index + 1} :`}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: isArabic ? day.ar : day.en,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {secondHalfDays.length > 0 && (
              <div className="page-break">
                <ul style={styles.list}>
                  {secondHalfDays.map((day: any, index: number) => {
                    const originalIndex = index + half;
                    return (
                      <li key={originalIndex} style={styles.listItem}>
                        <span style={styles.bullet}>•</span>
                        {isArabic
                          ? `${getDayOrdinal(originalIndex, "ar")} ${originalIndex + 1} :`
                          : `${getDayOrdinal(originalIndex, "en")} ${originalIndex + 1} :`}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: isArabic ? day.ar : day.en,
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        </div>

        <header style={styles.header}>
          <h1 style={styles.courseTitle}>{isArabic ? course?.name?.ar : course?.name?.en}</h1>
          <h2 style={styles.subtitle}>{isArabic ? "" : ""}</h2>
        </header>

        <section>
          <h3 style={styles.sectionTitle}>{isArabic ? t("descriptionAr") : t("descriptionEn")}</h3>
          <div style={styles.introduction}>
            <div
              dangerouslySetInnerHTML={{
                __html: convertToHTML(isArabic ? course?.description?.ar : course?.description?.en),
              }}
            />
          </div>
        </section>

        {(() => {
          const descriptionHTML = convertToHTML(isArabic ? course?.description?.ar : course?.description?.en) || "";
          const threshold = 1000;
          const commonStyles = {
            textAlign: isArabic ? "right" : "left",
            direction: isArabic ? "rtl" : "ltr",
            marginTop: "10px",
            color: "#555",
            fontSize: "16px",
          };

          if (descriptionHTML.length < threshold) {
            return <div style={commonStyles} dangerouslySetInnerHTML={{ __html: descriptionHTML }} />;
          } else {
            const mid = Math.floor(descriptionHTML.length / 2);
            const firstHalf = descriptionHTML.slice(0, mid);
            const secondHalf = descriptionHTML.slice(mid);

            return (
              <>
                <div className="page-break" style={commonStyles} dangerouslySetInnerHTML={{ __html: firstHalf }} />
                <div className="page-break" style={commonStyles} dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            );
          }
        })()}

        {type === "withoutCity" ? (
          <section>
            <h3 style={styles.sectionTitle}>
              {isArabic ? t("operationsWithoutCityAr") : t("operationsWithoutCityEn")}
            </h3>
          </section>
        ) : type === "withoutPrice" ? (
          <section style={{ marginTop: "20px" }}>
            <h3 style={styles.sectionTitle}>
              {isArabic ? t("operationsWithoutPriceAr") : t("operationsWithoutPriceEn")}
            </h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("startDateAr") : t("startDateEn")}
                  </th>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("endDateAr") : t("endDateEn")}
                  </th>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("cityAr") : t("cityEn")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {course?.operations?.map((op: any, index: number) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{formatDate(op.startDate)}</td>
                    <td style={styles.tableCell}>{formatDate(op.endDate)}</td>
                    <td style={styles.tableCell}>
                      {op.city ? op.city.name : isArabic ? t("notAvailableAr") : t("notAvailableEn")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section style={{ marginTop: "20px" }}>
            <h3 style={styles.sectionTitle}>
              {isArabic ? t("operationsWithoutPriceAr") : t("operationsWithoutPriceEn")}
            </h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("startDateAr") : t("startDateEn")}
                  </th>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("endDateAr") : t("endDateEn")}
                  </th>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("cityAr") : t("cityEn")}
                  </th>
                  <th style={{ ...styles.tableCell, ...styles.tableCellHeader }}>
                    {isArabic ? t("priceAr") : t("priceEn")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {course?.operations?.map((op: any, index: number) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{formatDate(op.startDate)}</td>
                    <td style={styles.tableCell}>{formatDate(op.endDate)}</td>
                    <td style={styles.tableCell}>
                      {op.city ? op.city.name : isArabic ? t("notAvailableAr") : t("notAvailableEn")}
                    </td>
                    <td style={styles.tableCell}>${op.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {course?.images?.map((img: any, index: number) => (
              <img
                key={index}
                src={img.secure_url}
                alt={`Image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        </section>
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
          </div>{" "}
          <p>&copy; 2025 High Point. {isArabic ? t("allRightsReservedAr") : t("allRightsReservedEn")}</p>
        </footer>
      </div>

      {btn ? (
        React.cloneElement(btn, { onClick: generatePDF })
      ) : (
        <div onClick={generatePDF} className="flex w-full cursor-pointer items-center mr-auto gap-2">
          <div className="w-10 h-10 relative">
            <Image src="/pdf.png" className="object-contain" fill alt="pdf" />
          </div>
          {type}
        </div>
      )}
    </div>
  );
};

export default ExportToPdf;
