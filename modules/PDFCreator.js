"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProductPDFGenerator(data) {
    const generatePDF = async () => {
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const seedList = data.src;
            
            for (let i = 0; i < seedList.length; i++) {
                const product = seedList[i];
                if (i !== 0) pdf.addPage();

                pdf.setFontSize(16);
                pdf.text(product.title, 20, 20);

                // Load image
                try {
                    const img = await loadImage(product.imageUrl);
                    pdf.addImage(img, "JPEG", 20, 30, 100, 75);
                } catch (error) {
                    console.error("Failed to load image:", error);
                    // Add placeholder text if image fails to load
                    pdf.text("Image not available", 20, 50);
                }

                // Add description
                const textLines = pdf.splitTextToSize(product.description, 170);
                pdf.text(textLines, 20, 120);
            }

            pdf.save("products.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // Helper function to load image
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";  // Handle CORS issues
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <button
                onClick={generatePDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
                Download Product PDF
            </button>
        </div>
    );
}
