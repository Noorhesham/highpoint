"use client"; // Client-side component
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import html2pdf from "html2pdf.js";

import { convertToHTML } from "../utils/fn";
import Image from "next/image";
import Logo from "./Logo";

const ExportToPdf = ({
  course,
  btn,
  type = "withputPrice",
}: {
  course: any;
  btn?: boolean;
  type?: "withoutPrice" | "withoutCity" | "all";
}) => {
  const pdfContentRef = useRef();

  // Function to generate and download the PDF
  const generatePDF = () => {
    const content = pdfContentRef.current;

    // Clone the content for PDF generation (without showing the original content)
    const clonedContent = content.cloneNode(true);

    // You can make some adjustments to the cloned content if needed, like styling
    // For example, you could make the cloned content visible only when generating the PDF
    clonedContent.style.visibility = "visible"; // Keep it hidden in the DOM
    clonedContent.style.display = "block"; // Make it visible in the PDF
    // Append the cloned content to the body, generate the PDF, then remove it

    const options = {
      margin: 10,
      filename: `${course.name.en}_Course.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate the PDF and save it
    html2pdf().from(clonedContent).set(options).save();
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };
  return (
    <div>
      {/* PDF content - hidden in browser view */}
      <div
        ref={pdfContentRef}
        className=""
        style={{
          fontFamily: "'Cairo', Arial, sans-serif",
          padding: "20px",
          direction: "rtl",
          textAlign: "right",
          display: "none", // Start with content hidden
        }}
      >
        <div className={` rounded-full relative  aspect-square overflow-hidden h-16 w-64`}>
          <img
            src={"/photo_2024-12-03_13-07-38-removebg-preview.png"}
            className=" w-full h-full absolute inset-0 object-left object-contain"
            alt="logo"
          />
        </div>{" "}
        <section style={{ marginTop: "20px" }}>
          <h3 className=" text-main">الفئات الفرعية</h3>
          <ul>
            {course.subCategories.map((sub: any) => (
              <li key={sub._id}>
                <p>{sub.name.en}</p>
                <p>{sub.name.ar}</p>
              </li>
            ))}
          </ul>
        </section>{" "}
        <section style={{ marginTop: "20px" }}>
          <h3 className=" text-main">الأيام</h3>
          <div>
            {/* English Days */}
            <ul style={{ direction: "ltr", textAlign: "left" }}>
              {course.days.map((day: any, index: number) => (
                <li key={index}>
                  day {index + 1} : <div dangerouslySetInnerHTML={{ __html: day.en }} />
                </li>
              ))}
            </ul>

            {/* Arabic Days */}
            <ul style={{ direction: "rtl", textAlign: "right", marginTop: "10px" }}>
              {course.days.map((day: any, index: number) => (
                <li key={index}>
                  اليوم <>{index + 1}:</> <div dangerouslySetInnerHTML={{ __html: day.ar }} />
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Header Section */}
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 className=" text-main" style={{ fontSize: "24px", margin: 0 }}>
            {course.name.en}
          </h1>
          <h2 className=" text-main" style={{ fontSize: "20px", color: "#888" }}>
            {course.name.ar}
          </h2>
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
        {type === "withoutCity" ? (
          <section>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>العمليات بدون المدينة</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ البدء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ الانتهاء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>السعر</th>
                </tr>
              </thead>
              <tbody>
                {course.operations.map((op, index) => (
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
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>العمليات بدون السعر</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ البدء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ الانتهاء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>المدينة</th>
                </tr>
              </thead>
              <tbody>
                {course.operations.map((op, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.startDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.endDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {op.city ? op.city.name : "غير متوفرة"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section style={{ marginTop: "20px" }}>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>العمليات بدون السعر</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ البدء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>تاريخ الانتهاء</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>المدينة</th>{" "}
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>السعر</th>
                </tr>
              </thead>
              <tbody>
                {course.operations.map((op, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.startDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(op.endDate)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {op.city ? op.city.name : "غير متوفرة"}
                    </td>{" "}
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>${op.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
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
        </section>{" "}
        <footer className="text-center mt-10 text-gray-500">
          <p>&copy; 2025 Your Company Name. All Rights Reserved.</p>
        </footer>
      </div>

      {/* Button to trigger PDF generation */}
      {btn ? (
        React.cloneElement(btn, { onClick: generatePDF })
      ) : (
        <button onClick={generatePDF} className=" w-10 h-10 relative">
          <Image src="/pdf.png" className=" object-contain" fill alt="pdf" />
        </button>
      )}
    </div>
  );
};

export default ExportToPdf;
