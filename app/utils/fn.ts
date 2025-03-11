import jsPDF from "jspdf";
import "jspdf-autotable";
import { CourseProps, OperationProps } from "@/app/models/Course";
export function convertToHTML(input: string) {
  let html = input;

  // Convert <strong> and <em> tags
  html = html.replace(/<strong>([^<]+)<\/strong>/g, "<strong>$1</strong>");
  html = html.replace(/<em>([^<]+)<\/em>/g, "<em>$1</em>");

  // Convert <p> tags
  html = html.replace(/<p>([^<]+)<\/p>/g, "<p>$1</p>");

  // Convert <ol> and <li> tags
  //@ts-ignore
  html = html.replace(/<ol>(.*?)<\/ol>/gs, "<ol>$1</ol>");
  html = html.replace(/<li>([^<]+)<\/li>/g, "<li>$1</li>");

  // Convert <h2> tags with class attributes
  html = html.replace(/<h2 class="([^"]+)" levels="2">([^<]+)<\/h2>/g, '<h2 class="$1">$2</h2>');

  // Convert <h3> tags with class attributes
  html = html.replace(/<h3 class="([^"]+)" levels="3">([^<]+)<\/h3>/g, '<h3 class="$1">$2</h3>');

  // Convert <h4> tags with class attributes
  html = html.replace(/<h4 class="([^"]+)" levels="4">([^<]+)<\/h4>/g, '<h4 class="$1">$2</h4>');

  // Convert <div> tags with class attributes
  html = html.replace(/<div class="([^"]+)">([^<]+)<\/div>/g, '<div class="$1">$2</div>');

  return html;
}
export const uploadImageToCloudinary = async (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  return response.json(); // Returns { secure_url, public_id }
};

// Helper to format dates
const formatDate = (date: Date) => new Intl.DateTimeFormat("en-US").format(new Date(date));

/**
 * Generates a PDF for the course data.
 * @param courses Array of courses with detailed data.
 * @param includePrices Whether to include operation prices in the PDF.
 */
export const generateSingleCoursePDF = async (course, version, logoURL, footerText) => {
  const pdf = new jsPDF();

  // Add Logo
  if (logoURL) {
    const img = await fetch(logoURL).then((res) => res.blob());
    const imgData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(img);
    });
    pdf.addImage(imgData, "JPEG", 10, 5, 30, 20);
  }

  // Course Header
  const startY = 30;
  pdf.setFontSize(14);
  pdf.text(`Course: ${course.name.en} / ${course.name.ar}`, 10, startY);
  pdf.setFontSize(12);
  pdf.text(`Duration: ${course.duration} hours`, 10, startY + 10);
  pdf.text(`Status: ${course.status}`, 10, startY + 20);

  // Add details based on the version
  if (version === 3) {
    pdf.text(`Price: ${course.price} USD`, 10, startY + 30);
  }

  if (version !== 2) {
    pdf.text(`City: ${course.city.name || "N/A"}`, 10, startY + 40);
  }

  // Course Description
  pdf.setFontSize(12);
  pdf.text("Description (EN):", 10, startY + 50);
  pdf.setFontSize(10);
  pdf.text(course.description.en, 10, startY + 60, { maxWidth: 190 });

  pdf.setFontSize(12);
  pdf.text("Description (AR):", 10, startY + 80);
  pdf.setFontSize(10);
  pdf.text(course.description.ar, 10, startY + 90, { maxWidth: 190, align: "right" });

  // Course Images
  if (course.images.length > 0) {
    let imageStartY = startY + 110;
    for (const image of course.images) {
      if (imageStartY > pdf.internal.pageSize.height - 50) {
        pdf.addPage();
        imageStartY = 20;
      }
      const img = await fetch(image.secure_url).then((res) => res.blob());
      const imgData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(img);
      });
      pdf.addImage(imgData, "JPEG", 10, imageStartY, 50, 30);
      imageStartY += 40;
    }
  }

  // Days Information
  pdf.setFontSize(12);
  pdf.text("Days:", 10, pdf.internal.pageSize.height - 70);
  course.days.forEach((day, index) => {
    pdf.setFontSize(10);
    pdf.text(`${index + 1}. ${day.en} / ${day.ar}`, 10, pdf.internal.pageSize.height - 60 + index * 10);
  });

  // Operations Table
  const tableData = course.operations.map((operation) => {
    const row = [
      operation.serialNumber,
      new Date(operation.startDate).toLocaleDateString(),
      new Date(operation.endDate).toLocaleDateString(),
    ];

    if (version !== 2) row.push(operation.city?.name || "N/A");
    if (version === 3) row.push(`$${operation.price}`);

    return row;
  });

  // Table Headers
  const tableHeaders = ["Serial Number", "Start Date", "End Date"];
  if (version !== 2) tableHeaders.push("City");
  if (version === 3) tableHeaders.push("Price");

  // Render the table
  pdf.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: pdf.internal.pageSize.height - 50,
  });

  // Footer Text
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(footerText, 10, pdf.internal.pageSize.height - 10);
  }

  // Save PDF
  pdf.save(`course-${course.name.en}.pdf`);
};
export function getDayOrdinal(index: number, locale = "en") {
  // Convert to 1-indexed day number
  const dayNumber = index + 1;

  if (locale === "ar") {
    // Arabic ordinals array (you can extend this as needed)
    const arabicOrdinals = [
      "الاول",
      "التاني",
      "التالت",
      "الرابع",
      "الخامس",
      "السادس",
      "السابع",
      "الثامن",
      "التاسع",
      "العاشر",
    ];
    // Return the Arabic ordinal or fallback to the number if index is out of bounds
    return arabicOrdinals[index] || dayNumber;
  } else {
    // English ordinals array (extend as needed)
    const englishOrdinals = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
    ];
    return englishOrdinals[index] || dayNumber;
  }
}
