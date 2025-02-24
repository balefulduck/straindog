"use client";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useRouter } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';


const StrainPreview = ({ searchQuery, selectedCategories, seedType }) => {
  const router = useRouter();
  const [strains, setStrains] = useState([]);
  const [displayedStrains, setDisplayedStrains] = useState([]);
  const [allStrains, setAllStrains] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const strainsPerPage = 3;

  const { comparisonStrains, addToComparison } = useComparison();

  // Load strains and set initial random strains
  useEffect(() => {
   
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => {
  
        setAllStrains(data);
        setStrains(data);
       
        if (data.length > 0) {
          const randomStrains = getRandomStrains(data, strainsPerPage);
          setDisplayedStrains(randomStrains);
        }
      })
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  const getRandomStrains = (strainList, count) => {
    const shuffled = [...strainList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const filterStrainsByCategories = (strainList, categories) => {
    if (!categories.length) return strainList;
    return strainList.filter(strain => 
      categories.some(category => strain.categories?.includes(category))
    );
  };

  // Update displayed strains when search query, categories, or seedType change
  useEffect(() => {
    let filteredStrains = [...allStrains];
    
    if (searchQuery) {
      setIsSearchMode(true);
      const query = searchQuery.toLowerCase();
      filteredStrains = filteredStrains.filter(strain =>
        strain.title.toLowerCase().includes(query) ||
        strain.breeder.toLowerCase().includes(query) ||
        strain.description.toLowerCase().includes(query)
      );
    } else {
      setIsSearchMode(false);
    }

    // Filter by seed type
    if (seedType) {
      filteredStrains = filteredStrains.filter(strain => strain.seedType === seedType);
    }

    filteredStrains = filterStrainsByCategories(filteredStrains, selectedCategories);
    setStrains(filteredStrains);
    setPage(1);
    
    if (searchQuery || selectedCategories.length > 0 || seedType) {
      setDisplayedStrains(filteredStrains.slice(0, strainsPerPage));
    } else {
      setDisplayedStrains(getRandomStrains(filteredStrains, strainsPerPage));
    }
  }, [searchQuery, selectedCategories, seedType, allStrains]);

  const loadMore = () => {
    if (isSearchMode) {
      const nextPage = page + 1;
      const newStrains = strains.slice(0, nextPage * strainsPerPage);
      setDisplayedStrains(newStrains);
      setPage(nextPage);
    } else {
      setDisplayedStrains(getRandomStrains(strains, strainsPerPage));
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isSearchMode) {
        setDisplayedStrains(getRandomStrains(strains, strainsPerPage));
      }
    },
    onSwipedRight: () => {
      if (!isSearchMode) {
        setDisplayedStrains(getRandomStrains(strains, strainsPerPage));
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleStrainClick = (strain) => {
    router.push(`/showcase?id=${strain.id}`);
  };

  if (!displayedStrains.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Keine Sorten gefunden</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div {...handlers} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedStrains.map((strain, index) => (
          <div 
            key={strain.id}
            className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4" 
          >
   
            {/* Comparison Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToComparison(strain);
              }}
              disabled={comparisonStrains.some(s => s.id === strain.id)}
              className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 
                       text-white rounded-full w-8 h-8 flex items-center justify-center 
                       transition-colors z-10"
              title="Add to comparison"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>

            <div onClick={() => handleStrainClick(strain)} className="cursor-pointer">
              {/* Thumbnail */}
              <div className="relative w-3/4 mx-auto aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={strain.imageUrl}
                  alt={strain.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{strain.title}</h3>
                    <p className="text-sm text-gray-600">by {strain.breeder}</p>
                  </div>
                  <div className="px-3 py-1 bg-purple-50 rounded-full">
                    <span className="text-sm font-medium text-purple-700">{strain.type || 'Hybrid'}</span>
                  </div>
                </div>
                
                {/* Key Stats */}
                <div className="flex gap-3">
                  <div className="px-3 py-1.5 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium text-amber-700">THC {strain.thc}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">CBD {strain.cbd}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col items-center gap-4 mt-6">
        {/* Show More Button - Always visible if there are more results */}
        {strains.length > displayedStrains.length && (
          <button
            onClick={loadMore}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Zeig mir mehr
          </button>
        )}
        
        {/* Random Strains Hint - Always visible */}
        <div className="px-4 py-2 bg-purple-50 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-sm text-purple-700">
            Wische für neue Zufallssorten
          </span>
        </div>
      </div>
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
