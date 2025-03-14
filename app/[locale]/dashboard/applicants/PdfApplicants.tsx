"use client";
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ExportApplicantsToPdfProps {
  applicants: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
  }[];
}

const ExportApplicantsToPdf: React.FC<ExportApplicantsToPdfProps> = ({ applicants }) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const generatePDF = () => {
    const content = pdfContentRef.current;
    if (!content) return;

    // Clone the content for PDF generation
    const clonedContent = content.cloneNode(true) as HTMLElement;
    clonedContent.style.display = "block";

    // PDF options
    const options = {
      margin: 10,
      filename: `Applicants_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(clonedContent).set(options).save();
  };

  return (
    <div>
      {/* Hidden PDF content */}
      <div
        ref={pdfContentRef}
        style={{
          display: "none",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>{t("applicantsList", "Applicants List")}</h1>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>{t("name", "Name")}</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>{t("email", "Email")}</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>{t("phone", "Phone")}</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>{t("date", "Date")}</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((applicant) => (
                <tr key={applicant._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {applicant.firstName} {applicant.lastName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{applicant.email}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{applicant.phone}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(applicant.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Button to trigger PDF generation */}
      <Button onClick={generatePDF}>{t("exportToPdf", "Export Applicants to PDF")}</Button>
    </div>
  );
};

export default ExportApplicantsToPdf;
