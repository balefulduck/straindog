"use client";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const StrainPreview = ({ searchQuery }) => {
  const router = useRouter();
  const [strains, setStrains] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomStrain, setRandomStrain] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Load strains and set initial random strain
  useEffect(() => {
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => {
        setStrains(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomStrain(data[randomIndex]);
        }
      })
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 3) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const filtered = strains.filter(strain => 
        strain.title.toLowerCase().includes(query) ||
        strain.breeder.toLowerCase().includes(query) ||
        strain.description.toLowerCase().includes(query)
      );
      setStrains(filtered);
      setCurrentIndex(0);
    } else {
      setIsSearching(false);
      // Reset to random strain view
      fetch('/api/seeds')
        .then(res => res.json())
        .then(data => {
          setStrains(data);
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomStrain(data[randomIndex]);
        });
    }
  }, [searchQuery]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isSearching && strains.length > 1) {
        setCurrentIndex((prev) => 
          prev === strains.length - 1 ? 0 : prev + 1
        );
      }
      if (!isSearching) {
        const randomIndex = Math.floor(Math.random() * strains.length);
        setRandomStrain(strains[randomIndex]);
      }
    },
    onSwipedRight: () => {
      if (isSearching && strains.length > 1) {
        setCurrentIndex((prev) => 
          prev === 0 ? strains.length - 1 : prev - 1
        );
      }
      if (!isSearching) {
        const randomIndex = Math.floor(Math.random() * strains.length);
        setRandomStrain(strains[randomIndex]);
      }
    },
  });

  const handleStrainClick = () => {
    const strain = isSearching ? strains[currentIndex] : randomStrain;
    if (strain) {
      router.push(`/showcase?id=${strain.id}`);
    }
  };

  if (!strains.length) {
    return <div className="text-gray-500 text-center text-sm p-4">No strains found</div>;
  }

  const currentStrain = isSearching ? strains[currentIndex] : randomStrain;
  if (!currentStrain) return null;

  return (
    <div {...handlers} className="w-full bg-white">
      <div className="mx-auto px-4">
        {!isSearching && (
          <h3 className="text-center text-sm font-medium text-gray-500 mb-3">
            Strain des Augenblicks
          </h3>
        )}
        
        <div 
          className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
          onClick={handleStrainClick}
        >
          {/* Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={currentStrain.imageUrl}
              alt={currentStrain.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900">{currentStrain.title}</h3>
            <p className="text-xs text-gray-600 mb-1">{currentStrain.breeder}</p>
            
            <div className="flex gap-3 text-xs mb-2">
              <span className="text-gray-700">THC: {currentStrain.thc}</span>
              <span className="text-gray-700">CBD: {currentStrain.cbd}</span>
            </div>
            
            <p className="text-xs text-gray-600 line-clamp-2">{currentStrain.description}</p>
          </div>

          {/* Navigation Arrows (only show if searching and multiple results) */}
          {isSearching && strains.length > 1 && (
            <div className="flex flex-col justify-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(prev => prev === 0 ? strains.length - 1 : prev - 1);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(prev => prev === strains.length - 1 ? 0 : prev + 1);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Results counter when searching */}
        {isSearching && strains.length > 1 && (
          <p className="text-center text-xs text-gray-500 mt-2">
            {currentIndex + 1} of {strains.length} results
          </p>
        )}
      </div>
       {/* New Random Strain*/}
      {!isSearching && (
        <div className="flex items-center justify-center gap-4 mt-4 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                         bg-[#8E0365]
                        shadow-lg transform hover:scale-105 transition-all">
       
            <span className="text-xs font-medium text-white swipeleft">
              Wisch nach links für einen neuen Zufallsstrain
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                        bg-[#8E0365]
                        shadow-lg transform hover:scale-105 transition-all">
    
            <span className="text-xs font-medium text-white swipeleft">
              Wisch nach rechts um Dir den Strain zu merken
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrainPreview;

<style jsx>{`
  @keyframes swipe-left {
    0%, 100% {
      transform: translateX(0);
      opacity: 0.5;
    }
    50% {
      transform: translateX(-4px);
      opacity: 1;
    }
  }
  .animate-swipe-left {
    animation: swipe-left 2s ease-in-out infinite;
  }
  .swipeleft {
    font-family: monospace;
    font-size: .1em
  }
`}</style>
