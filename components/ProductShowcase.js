"use client";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import PDFCreator from "../modules/PDFCreator";
import SeedListEditor from "./SeedListEditor";

const ProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seedList, setSeedList] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    // Load seeds from the API on component mount
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => {
        // If no seeds are saved yet, use the default ones
        if (data.length === 0) {
          const defaultSeeds = [
            {
              id: 1,
              title: "Mylar Magic",
              breeder: "Nine Weeks Harvest",
              description: "This is a description of Mylar Magic",
              thc: "22%",
              cbd: "0.51%",
              terpenes: [
                { name: "β-Caryophyllene", percentage: "30%" },
                { name: "Limonene", percentage: "20%" },
                { name: "Pinene", percentage: "15%" },
              ],
              genetics: {
                type: "Hybrid",
                mother: "Northern Lights",
                father: "Skunk #1",
              },
              effect: "",
              imageUrl: "https://www.tomhemps.com/wp-content/uploads/2024/04/mmstrain.jpg",
            },
            {
              id: 2,
              title: "White Widow",
              description: "This is a description of White Widow",
              thc: "18%",
              cbd: "0.3%",
              terpenes: [
                { name: "β-Caryophyllene", percentage: "25%" },
                { name: "Myrcene", percentage: "20%" },
                { name: "Pinene", percentage: "15%" },
              ],
              genetics: {
                type: "Hybrid",
                mother: "Brazilian Sativa",
                father: "South Indian Indica",
              },
              effect: "",
              imageUrl: "https://shop.greenhouseseeds.nl/images/thumbnails/346/453/detailed/10/WHITE_WIDOW.jpg"
            },
          ];
          setSeedList(defaultSeeds);
          // Save default seeds to the API
          fetch('/api/seeds', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(defaultSeeds),
          });
        } else {
          setSeedList(data);
        }
      })
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === seedList.length - 1 ? 0 : prevIndex + 1
      );
    },
    onSwipedRight: () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? seedList.length - 1 : prevIndex - 1
      );
    },
  });

  const handleUpdateSeedList = (updatedSeeds) => {
    setSeedList(updatedSeeds);
    if (currentIndex >= updatedSeeds.length) {
      setCurrentIndex(Math.max(0, updatedSeeds.length - 1));
    }
  };

  if (seedList.length === 0) {
    return <div>No data</div>;
  }

  const currentSeed = seedList[currentIndex];

  return (
    <div {...handlers} className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Title, Subtitle, and Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentSeed.title}</h1>
              <h2 className="text-xl text-gray-600 mb-6">{currentSeed.breeder}</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Kurzgesagt Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Kurzgesagt</h3>
                  <p className="text-gray-700">{currentSeed.description}</p>
                </div>
                
                {/* Grow Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Grow</h3>
                  <p className="text-gray-700">{currentSeed.flowertime} Tage</p>
                </div>
              </div>
            </div>

            {/* Right side: Image and Additional Info */}
            <div className="flex-1">
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <img
                  src={currentSeed.imageUrl}
                  alt={currentSeed.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Wirkung Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Wirkung</h3>
                  <p className="text-gray-700">{currentSeed.effect}</p>
                </div>

                {/* Wirkstoffe Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Wirkstoffe</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">THC</p>
                        <p className="text-gray-700">{currentSeed.thc}</p>
                      </div>
                      <div>
                        <p className="font-medium">CBD</p>
                        <p className="text-gray-700">{currentSeed.cbd}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Terpene Profile</p>
                      <div className="space-y-2">
                        {currentSeed.terpenes.map((terpene, index) => (
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
                      <p className="text-gray-700">{currentSeed.genetics.type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Mother</p>
                        <p className="text-gray-700">{currentSeed.genetics.mother}</p>
                      </div>
                      <div>
                        <p className="font-medium">Father</p>
                        <p className="text-gray-700">{currentSeed.genetics.father}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsEditorOpen(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      </div>

      <SeedListEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        seedList={seedList}
        onUpdateSeedList={handleUpdateSeedList}
      />

      <PDFCreator currentSeed={currentSeed} />
    </div>
  );
};

export default ProductShowcase;