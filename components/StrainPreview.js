"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const StrainPreview = ({ searchQuery, selectedCategories }) => {
  const router = useRouter();
  const [strains, setStrains] = useState([]);
  const [displayedStrains, setDisplayedStrains] = useState([]);
  const [allStrains, setAllStrains] = useState([]);
  const [page, setPage] = useState(1);
  const strainsPerPage = 3;

  // Load strains and set initial random strains
  useEffect(() => {
    fetch('/api/seeds')
      .then(res => res.json())
      .then(data => {
        setAllStrains(data);
        setStrains(data);
        if (data.length > 0) {
          setDisplayedStrains(data.slice(0, strainsPerPage));
        }
      })
      .catch(error => console.error('Error loading seeds:', error));
  }, []);

  const filterStrainsByCategories = (strainList, categories) => {
    if (!categories.length) return strainList;
    return strainList.filter(strain => 
      categories.some(category => strain.categories?.includes(category))
    );
  };

  // Update displayed strains when search query or categories change
  useEffect(() => {
    let filteredStrains = [...allStrains];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStrains = filteredStrains.filter(strain =>
        strain.title.toLowerCase().includes(query) ||
        strain.breeder.toLowerCase().includes(query) ||
        strain.description.toLowerCase().includes(query)
      );
    }

    filteredStrains = filterStrainsByCategories(filteredStrains, selectedCategories);
    setStrains(filteredStrains);
    setPage(1);
    setDisplayedStrains(filteredStrains.slice(0, strainsPerPage));
  }, [searchQuery, selectedCategories, allStrains]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newStrains = strains.slice(0, nextPage * strainsPerPage);
    setDisplayedStrains(newStrains);
    setPage(nextPage);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedStrains.map((strain) => (
          <div 
            key={strain.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4" 
            onClick={() => handleStrainClick(strain)}
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
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
        ))}
      </div>

      {/* Show more button */}
      {strains.length > displayedStrains.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Zeig mir mehr
          </button>
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
