"use client";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import PDFCreator from "../modules/PDFCreator";
import SeedListEditor from "../components/SeedListEditor";

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
              terpenes: "β-Caryophyllen",
              effect: "",
              imageUrl: "https://www.tomhemps.com/wp-content/uploads/2024/04/mmstrain.jpg",
            },
            {
              id: 2,
              title: "White Widow",
              description: "This is a description of White Widow",
              thc: "18%",
              cbd: "0.3%",
              terpenes: "β-Caryophyllen",
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-96">
          <img
            src={currentSeed.imageUrl}
            alt={currentSeed.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{currentSeed.title}</h2>
          {currentSeed.breeder && (
            <p className="text-gray-600 mb-2">Breeder: {currentSeed.breeder}</p>
          )}
          <p className="text-gray-700 mb-4">{currentSeed.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">THC:</p>
              <p>{currentSeed.thc}</p>
            </div>
            <div>
              <p className="font-semibold">CBD:</p>
              <p>{currentSeed.cbd}</p>
            </div>
            <div>
              <p className="font-semibold">Terpenes:</p>
              <p>{currentSeed.terpenes}</p>
            </div>
            {currentSeed.effect && (
              <div>
                <p className="font-semibold">Effect:</p>
                <p>{currentSeed.effect}</p>
              </div>
            )}
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
