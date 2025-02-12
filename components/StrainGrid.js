"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import PDFCreator from "../modules/PDFCreator";
import Header from "./Header";

const StrainGrid = () => {
  const [strains, setStrains] = useState([]);
  const router = useRouter();
  const [showPdfButton, setShowPdfButton] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => setStrains(data))
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  const handleStrainClick = (strainId) => {
    router.push(`/showcase?id=${strainId}`);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput.toLowerCase() === 'drc') {
      setShowPasswordPrompt(false);
      setPasswordInput('');
    } else {
      setPasswordInput('');
    }
  };

  const handlePdfClick = () => {
    setShowPasswordPrompt(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[5vh] p-4">
        <div className="max-w-7xl mx-auto">
         
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {strains.map((strain) => (
              <div
                key={strain.id}
                onClick={() => handleStrainClick(strain.id)}
                className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={strain.imageUrl}
                    alt={strain.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">{strain.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{strain.breeder}</p>
                  
                  <div className="flex gap-3 text-xs mb-2">
                    <span className="text-gray-700">THC: {strain.thc}</span>
                    <span className="text-gray-700">CBD: {strain.cbd}</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2">{strain.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with PDF Button */}
          <div className="border-t border-gray-100 pt-8 pb-16 mt-auto">
            <div className="flex flex-col items-center">
              {showPdfButton ? (
                <PDFCreator strains={strains} />
              ) : (
                <button
                  onClick={handlePdfClick}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md border border-gray-300 hover:border-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {/* Password Prompt Modal */}
          {showPasswordPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">PDF Access</h3>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border rounded-md mb-4"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPasswordInput('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StrainGrid;
