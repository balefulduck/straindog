"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import PDFCreator from "../modules/PDFCreator";
import Header from "./Header";

const StrainGrid = () => {
  const [strains, setStrains] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => setStrains(data))
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  const handleStrainClick = (strainId) => {
    router.push(`/showcase?id=${strainId}`);
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

          {/* Footer with subtle PDF download */}
          <div className="border-t border-gray-100 pt-8 pb-16 mt-auto">
            <div className="flex justify-center">
              <PDFCreator strains={strains} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrainGrid;
