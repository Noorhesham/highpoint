import React from "react";
import jsPDF from "jspdf";
import Image from "next/image";

interface ExportToPDFProps {
  item: any; // Define your data structure as needed
  includeDates?: boolean; // Flag to include dates
}

const ExportToPDF: React.FC<ExportToPDFProps> = ({ item, includeDates = true }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    doc.text(`ID: ${item._id}`, 10, 20);
    doc.text(`Name (EN): ${item.name.en}`, 10, 30);
    doc.text(`Name (AR): ${item.name.ar}`, 10, 40);
    doc.text(`Price: ${item.price}`, 10, 50);
    doc.text(`Serial Number: ${item.serialNumber}`, 10, 60);
    doc.text(`Duration: ${item.duration}`, 10, 70);

    if (includeDates) {
      doc.text(`Start Date: ${item.startDate}`, 10, 80);
      doc.text(`End Date: ${item.endDate}`, 10, 90);
    }

    doc.save(`export_${includeDates ? "with_dates" : "no_dates"}.pdf`);
  };

  return (
    <button
      className="w-14 h-14 relative"
      onClick={handleExport}
      title={includeDates ? "Export with dates" : "Export without dates"}
    >
      <Image src="/pdf.png" alt="pdf" fill />
    </button>
  );
};

export default ExportToPDF;
