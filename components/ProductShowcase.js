"use client";
import { useState, useEffect, Suspense } from "react";
import { useSwipeable } from "react-swipeable";
import { useSearchParams } from 'next/navigation';
import SeedListEditor from "./SeedListEditor";
import Header from "./Header";
import Image from 'next/image';

const ProductShowcaseContent = () => {
  const searchParams = useSearchParams();
  const [currentStrain, setCurrentStrain] = useState(null);
  const [seedList, setSeedList] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    const strainId = searchParams.get('id');
    
    // Load seeds from the API
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => {
        setSeedList(data);
        
        // Find the strain with the matching ID
        if (strainId) {
          const strain = data.find(s => s.id.toString() === strainId.toString());
          if (strain) {
            setCurrentStrain(strain);
          } else {
            console.error(`Strain with ID ${strainId} not found`);
            setCurrentStrain(data[0]); // Fallback to first strain if ID not found
          }
        } else {
          setCurrentStrain(data[0]); // Default to first strain if no ID provided
        }
      })
      .catch(error => console.error('Error loading seeds:', error));
  }, [searchParams]);

  // Handle keypress events for the password
  useEffect(() => {
    let buffer = '';
    let timeoutId;

    const handleKeyPress = (e) => {
      buffer += e.key;
      
      // Reset buffer after 1 second of no input
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        buffer = '';
      }, 1000);

      // Check if buffer contains the password
      if (buffer.toLowerCase().includes('drc')) {
        setShowEditButton(true);
        buffer = '';
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = seedList.findIndex(s => s.id === currentStrain.id);
      const nextIndex = (currentIndex + 1) % seedList.length;
      setCurrentStrain(seedList[nextIndex]);
    },
    onSwipedRight: () => {
      const currentIndex = seedList.findIndex(s => s.id === currentStrain.id);
      const prevIndex = currentIndex === 0 ? seedList.length - 1 : currentIndex - 1;
      setCurrentStrain(seedList[prevIndex]);
    },
  });

  if (!currentStrain) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onEditorOpen={() => setIsEditorOpen(true)} />
      
      <main {...handlers} className="pt-[5vh] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div>
                <Image
                  src={currentStrain.imageUrl}
                  alt={currentStrain.title}
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-auto"
                  onError={(e) => {
                    e.target.src = "https://images.leafly.com/flower-images/defaults/generic/strain-1.png";
                  }}
                />
              </div>

              {/* Right Column - Info */}
              <div className="flex flex-col h-full justify-between">
                {/* Title and Basic Info */}
                <div className="mb-4">
                  <h2 className="text-2xl font-medium mb-1">{currentStrain.title}</h2>
                  <p className="text-gray-600 font-extralight mb-3">{currentStrain.breeder}</p>
                  <div className="flex gap-4 mb-4">
                    <div className="bg-gray-50 px-3 py-2 rounded">
                      <span className="font-medium">THC:</span> {currentStrain.thc}
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded">
                      <span className="font-medium">CBD:</span> {currentStrain.cbd}
                    </div>
                  </div>
                  <p className="text-gray-700">{currentStrain.description}</p>
                </div>
              </div>
            </div>

            {/* Bottom Sections */}
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Wirkstoffe Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-900 border-b pb-2">Terpenrofil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    
                      <div className="space-y-2">
                        {currentStrain.terpenes?.map((terpene, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{terpene.name}</span>
                            <span className="text-gray-600">{terpene.percentage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Genetics Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-900 border-b pb-2">Genetik</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Typ</p>
                      <p className="text-gray-700">{currentStrain.genetics?.type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="font-medium">♀</p>
                        <p className="text-gray-700">{currentStrain.genetics?.mother}</p>
                      </div>
                      <div>
                        <p className="font-medium">♂</p>
                        <p className="text-gray-700">{currentStrain.genetics?.father}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Seed List Editor Button */}
      <div className="border-t border-gray-100 pt-8 pb-16 mt-auto">
        <div className="flex justify-center">
          {showEditButton ? (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Samenliste bearbeiten
            </button>
          ) : (
            <div className="text-sm text-gray-400">
              Gib den Code ein, um die Bearbeitungsfunktion freizuschalten
            </div>
          )}
        </div>
      </div>

      <SeedListEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        seedList={seedList}
        onUpdateSeedList={setSeedList}
      />
    </div>
  );
};

const ProductShowcase = () => {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <ProductShowcaseContent />
    </Suspense>
  );
};

export default ProductShowcase;