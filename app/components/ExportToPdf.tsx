import React from "react";
import jsPDF from "jspdf";

interface ExportToPDFProps {
  data: any[]; // Define your data structure as needed
}

const ExportToPDF: React.FC<ExportToPDFProps> = ({ item }: { item: any }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text(`ID: ${item._id}`, 10, 20);
    doc.text(`Name (EN): ${item.name.en}`, 10, 30);
    doc.text(`Name (AR): ${item.name.ar}`, 10, 40);
    doc.text(`Price: ${item.price}`, 10, 50);
    doc.text(`Serial Number: ${item.serialNumber}`, 10, 60);
    doc.text(`Duration: ${item.duration}`, 10, 70);
    doc.addPage();

    doc.save("export.pdf");
  };

  return <button onClick={handleExport}>Export to PDF</button>;
};

export default ExportToPDF;
