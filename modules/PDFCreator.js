"use client";
import { jsPDF } from "jspdf";

const PDFCreator = ({ strains }) => {
  const loadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  };

  const createPDF = async () => {
    const doc = new jsPDF();
    let currentPage = 1;

    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingIndicator.innerHTML = '<div class="bg-white p-4 rounded-lg"><p class="text-gray-800">Generiere PDF...</p></div>';
    document.body.appendChild(loadingIndicator);

    try {
      for (const [index, strain] of strains.entries()) {
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
        doc.text(strain.breeder || 'Unbekannter Züchter', 20, 30);

        // Load and add image
        try {
          const imageData = await loadImage(strain.imageUrl);
          if (imageData) {
            // Add image with compression
            doc.addImage(
              imageData,
              'JPEG',
              20, // x
              40, // y
              60, // width
              60, // height
              undefined,
              'MEDIUM' // compression
            );

            // Add THC/CBD content next to the image
            if (strain.thc || strain.cbd) {
              doc.setFontSize(14);
              doc.setTextColor(0);
              doc.text('THC / CBD:', 90, 50);
              doc.setFontSize(16);
              doc.setTextColor(142, 3, 101);
              doc.text(`${strain.thc || 'N/A'} : ${strain.cbd || 'N/A'}`, 90, 60);
            }
          }
        } catch (error) {
          console.error('Error adding image to PDF:', error);
        }

        // Add description (moved down to after the image)
        doc.setFontSize(12);
        doc.setTextColor(60);
        const descriptionLines = doc.splitTextToSize(strain.description || 'Keine Beschreibung verfügbar', 170);
        doc.text(descriptionLines, 20, 110);

        // Calculate starting Y position for the next sections based on description length
        let currentY = 110 + (descriptionLines.length * 7);

        // Add genetics if available
        if (strain.genetics) {
          currentY += 10; // Add some spacing
          doc.setFontSize(14);
          doc.text('Genetik:', 20, currentY);
          doc.setFontSize(12);
          doc.text([
            `Typ: ${strain.genetics.type || 'N/A'}`,
            `Mutter: ${strain.genetics.mother || 'N/A'}`,
            `Vater: ${strain.genetics.father || 'N/A'}`
          ], 30, currentY + 10);
          currentY += 40; // Increase for the three lines of genetics info
        }

        // Add terpenes if available
        if (strain.terpenes && strain.terpenes.length > 0) {
          doc.setFontSize(14);
          doc.text('Terpenprofil:', 20, currentY);
          doc.setFontSize(12);
          strain.terpenes.forEach((terpene, idx) => {
            doc.text(`${terpene.name}: ${terpene.percentage}`, 30, currentY + 10 + (idx * 7));
          });
          currentY += 10 + (strain.terpenes.length * 7) + 10; // Add spacing after terpenes
        }

        // Add effect if available
        if (strain.effect) {
          doc.setFontSize(14);
          doc.text('Effekt:', 20, currentY);
          doc.setFontSize(12);
          const effectLines = doc.splitTextToSize(strain.effect, 150);
          doc.text(effectLines, 30, currentY + 10);
        }

        // Add page number
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Seite ${currentPage} von ${strains.length}`, 180, 10, { align: 'right' });
      }

      // Save the PDF
      doc.save('strain-catalog.pdf');
    } finally {
      // Remove loading indicator
      document.body.removeChild(loadingIndicator);
    }
  };

  return (
    <button
      onClick={() => createPDF()}
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
