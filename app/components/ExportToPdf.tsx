"use client"; // Client-side component
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import html2pdf from "html2pdf.js";
import { convertToHTML, getDayOrdinal } from "../utils/fn";
import Image from "next/image";
import Logo from "./Logo";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Added isArabic?: boolean
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
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Function to generate and download the PDF
  const generatePDF = () => {
    const content = pdfContentRef.current;
    if (!content) return;

    // Clone the content for PDF generation
    const clonedContent = content.cloneNode(true) as HTMLElement;

    // Make the cloned content visible for PDF generation
    clonedContent.style.visibility = "visible";
    clonedContent.style.display = "block";

    // PDF options
    const options = {
      margin: 10,
      filename: `${course?.name?.en}_Course.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      // pagebreak: { mode: ["avoid-all", "css"] },
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
  return (
    <div>
      {/* PDF content - hidden in browser view */}
      <div
        ref={pdfContentRef}
        style={{
          fontFamily: "'Cairo', Arial, sans-serif",
          padding: "20px",
          // Use RTL if Arabic, LTR if English
          direction: isArabic ? "rtl" : "ltr",
          textAlign: isArabic ? "right" : "left",
          display: "none", // Start with content hidden
        }}
      >
        {/* Logo */}

        {/* Sub-Categories */}
        <div style={{ marginTop: "20px" }}>
          {" "}
          <div className="rounded-full relative mx-auto aspect-square overflow-hidden h-16 w-64">
            <img
              src="/photo_2024-12-03_13-07-38-removebg-preview.png"
              className="w-full h-full absolute inset-0 object-left object-contain"
              alt="logo"
            />
          </div>
          <h3 className="text-main">{isArabic ? t("subCategoriesAr") : t("subCategoriesEn")}</h3>
          <ul>
            {course?.subCategories?.map((sub: any) => (
              <li key={sub._id}>
                {/* Show only the relevant language */}
                <p>{isArabic ? sub.name.ar : sub.name.en}</p>
              </li>
            ))}
          </ul>{" "}
          <h3 className="text-main">{isArabic ? t("daysAr") : t("daysEn")}</h3>
          <>
            <div className="page-break">
              <ul
                style={{
                  direction: isArabic ? "rtl" : "ltr",
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {firstHalfDays.map((day: any, index: number) => (
                  <li key={index}>
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
                <ul
                  style={{
                    direction: isArabic ? "rtl" : "ltr",
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {secondHalfDays.map((day: any, index: number) => {
                    // Calculate original index for correct ordinal numbering
                    const originalIndex = index + half;
                    return (
                      <li key={originalIndex}>
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

        {/* Days Section */}

        {/* Header Section */}
        <header className="page-break" style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 className="text-main" style={{ fontSize: "24px", margin: 0 }}>
            {isArabic ? course?.name?.ar : course?.name?.en}
          </h1>
          {/* If you don't want a second line in single-language mode, remove this.
                Otherwise, you can keep it or show the alternate name. */}
          <h2 className="text-main" style={{ fontSize: "20px", color: "#888" }}>
            {isArabic ? "" : ""}
          </h2>
        </header>

        {/* Description Section */}
        <section className="">
          <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
            {isArabic ? t("descriptionAr") : t("descriptionEn")}
          </h3>
          <div>
            <div
              style={{
                textAlign: isArabic ? "right" : "left",
                direction: isArabic ? "rtl" : "ltr",
                marginTop: "10px",
              }}
              dangerouslySetInnerHTML={{
                __html: convertToHTML(isArabic ? course?.description?.ar : course?.description?.en),
              }}
            />
          </div>
        </section>

        {/* Course Details */}
        {(() => {
          const descriptionHTML = convertToHTML(isArabic ? course?.description?.ar : course?.description?.en) || "";
          // Define a threshold; adjust as needed.
          const threshold = 1000;

          const commonStyles = {
            textAlign: isArabic ? "right" : "left",
            direction: isArabic ? "rtl" : "ltr",
            marginTop: "10px",
          };

          if (descriptionHTML.length < threshold) {
            return <div style={commonStyles} dangerouslySetInnerHTML={{ __html: descriptionHTML }} />;
          } else {
            // Split the description in two parts.
            // WARNING: This simple split might break HTML structure.
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

        {/* Operations Table (type-based) */}
        {type === "withoutCity" ? (
          <section>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
              {isArabic ? t("operationsWithoutCityAr") : t("operationsWithoutCityEn")}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("startDateAr") : t("startDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("endDateAr") : t("endDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>{isArabic ? t("priceAr") : t("priceEn")}</th>
                </tr>
              </thead>
              <tbody>
                {course?.operations?.map((op: any, index: number) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.startDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.endDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>${op.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : type === "withoutPrice" ? (
          <section style={{ marginTop: "20px" }}>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
              {isArabic ? t("operationsWithoutPriceAr") : t("operationsWithoutPriceEn")}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("startDateAr") : t("startDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("endDateAr") : t("endDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>{isArabic ? t("cityAr") : t("cityEn")}</th>
                </tr>
              </thead>
              <tbody>
                {course?.operations?.map((op: any, index: number) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.startDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.endDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {op.city ? op.city.name : isArabic ? t("notAvailableAr") : t("notAvailableEn")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section style={{ marginTop: "20px" }}>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
              {isArabic ? t("operationsWithoutPriceAr") : t("operationsWithoutPriceEn")}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("startDateAr") : t("startDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {isArabic ? t("endDateAr") : t("endDateEn")}
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>{isArabic ? t("cityAr") : t("cityEn")}</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>{isArabic ? t("priceAr") : t("priceEn")}</th>
                </tr>
              </thead>
              <tbody>
                {course?.operations?.map((op: any, index: number) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.startDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.endDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {op.city ? op.city.name : isArabic ? t("notAvailableAr") : t("notAvailableEn")}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>${op.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Images Section */}
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

        {/* Footer */}
        <footer className="text-center mt-10 text-gray-500">
          <p>&copy; 2025 High Point. {isArabic ? t("allRightsReservedAr") : t("allRightsReservedEn")}</p>
        </footer>
      </div>

      {/* Button to trigger PDF generation */}
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

// You’d define translation keys like
