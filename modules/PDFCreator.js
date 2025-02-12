"use client";
import { jsPDF } from "jspdf";

const PDFCreator = ({ strains }) => {
  const createPDF = () => {
    const doc = new jsPDF();
    let currentPage = 1;

    strains.forEach((strain, index) => {
      if (index > 0) {
        doc.addPage();
        currentPage++;
      }

      // Add title
      doc.setFontSize(24);
      doc.setTextColor(142, 3, 101); // #8E0365
      doc.text(strain.title, 20, 20);

      // Add breeder
      doc.setFontSize(16);
      doc.setTextColor(100);
      doc.text(strain.breeder || 'Unknown Breeder', 20, 30);

      // Add description
      doc.setFontSize(12);
      doc.setTextColor(60);
      const descriptionLines = doc.splitTextToSize(strain.description || 'No description available', 170);
      doc.text(descriptionLines, 20, 45);

      // Add THC and CBD content
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`THC: ${strain.thc || 'N/A'}    CBD: ${strain.cbd || 'N/A'}`, 20, 80);

      // Add genetics if available
      if (strain.genetics) {
        doc.setFontSize(14);
        doc.text('Genetics:', 20, 100);
        doc.setFontSize(12);
        doc.text([
          `Type: ${strain.genetics.type || 'N/A'}`,
          `Mother: ${strain.genetics.mother || 'N/A'}`,
          `Father: ${strain.genetics.father || 'N/A'}`
        ], 30, 110);
      }

      // Add terpenes if available
      if (strain.terpenes && strain.terpenes.length > 0) {
        doc.setFontSize(14);
        doc.text('Terpene Profile:', 20, 140);
        doc.setFontSize(12);
        strain.terpenes.forEach((terpene, idx) => {
          doc.text(`${terpene.name}: ${terpene.percentage}`, 30, 150 + (idx * 10));
        });
      }

      // Add effect if available
      if (strain.effect) {
        doc.setFontSize(14);
        doc.text('Effect:', 20, 190);
        doc.setFontSize(12);
        const effectLines = doc.splitTextToSize(strain.effect, 150);
        doc.text(effectLines, 30, 200);
      }

      // Add page number
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${currentPage} of ${strains.length}`, 180, 10, { align: 'right' });
    });

    // Save the PDF
    doc.save('strain-catalog.pdf');
  };

  return (
    <button
      onClick={createPDF}
      className="text-gray-400 hover:text-gray-600 text-sm px-4 py-2 flex items-center gap-2 transition-colors duration-200"
      title="PDF Katalog herunterladen"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      <span className="font-light">Katalog als PDF</span>
    </button>
  );
};

export default PDFCreator;
