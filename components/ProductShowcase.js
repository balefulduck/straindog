"use client";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useSearchParams } from 'next/navigation';
import SeedListEditor from "./SeedListEditor";
import Header from "./Header";

const ProductShowcase = () => {
  const searchParams = useSearchParams();
  const [currentStrain, setCurrentStrain] = useState(null);
  const [seedList, setSeedList] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side: Title, Subtitle, and Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentStrain.title}</h1>
                <h2 className="text-xl text-gray-600 mb-6">{currentStrain.breeder}</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Kurzgesagt Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Kurzgesagt</h3>
                    <p className="text-gray-700">{currentStrain.description}</p>
                  </div>
                  
                  {/* Grow Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Grow</h3>
                    <p className="text-gray-700">{currentStrain.flowertime} Tage</p>
                  </div>
                </div>
              </div>

              {/* Right side: Image and Additional Info */}
              <div className="flex-1">
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={currentStrain.imageUrl}
                    alt={currentStrain.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Wirkung Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Wirkung</h3>
                    <p className="text-gray-700">{currentStrain.effect}</p>
                  </div>

                  {/* Wirkstoffe Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Wirkstoffe</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">THC</p>
                          <p className="text-gray-700">{currentStrain.thc}</p>
                        </div>
                        <div>
                          <p className="font-medium">CBD</p>
                          <p className="text-gray-700">{currentStrain.cbd}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Terpene Profile</p>
                        <div className="space-y-2">
                          {currentStrain.terpenes?.map((terpene, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">{terpene.name}</span>
                              <span className="text-gray-500">{terpene.percentage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Genetics Section */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <h3 className="font-semibold text-lg mb-2">Genetics</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-gray-700">{currentStrain.genetics?.type}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Mother</p>
                          <p className="text-gray-700">{currentStrain.genetics?.mother}</p>
                        </div>
                        <div>
                          <p className="font-medium">Father</p>
                          <p className="text-gray-700">{currentStrain.genetics?.father}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SeedListEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        seedList={seedList}
        onUpdateSeedList={setSeedList}
      />
    </div>
  );
};

export default ProductShowcase;