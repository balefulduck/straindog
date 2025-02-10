"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { searchStrains } from '../modules/SearchModule';

const properties = [
  { id: 'high-cbd', label: 'High CBD', color: 'border-blue-500' },
  { id: 'high-thc', label: 'High THC', color: 'border-purple-500' },
  { id: 'relaxing', label: 'Relaxing', color: 'border-green-500' },
  { id: 'pain-killer', label: 'Pain Relief', color: 'border-red-500' },
  { id: 'sleep', label: 'Sleep Aid', color: 'border-indigo-500' },
  { id: 'energy', label: 'Energizing', color: 'border-yellow-500' }
];

export default function LandingPage() {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    thc: '',
    cbd: '',
    breeder: '',
    strainName: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchStrains({
      properties: selectedProperties,
      advanced: filters
    });
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Filter Button */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white shadow-md">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-4 px-6 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>Filter</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">THC Content</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="e.g. >20%"
                      value={filters.thc}
                      onChange={(e) => setFilters({...filters, thc: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CBD Content</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="e.g. >10%"
                      value={filters.cbd}
                      onChange={(e) => setFilters({...filters, cbd: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Breeder</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="Enter breeder name"
                      value={filters.breeder}
                      onChange={(e) => setFilters({...filters, breeder: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Strain Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="Search by name"
                      value={filters.strainName}
                      onChange={(e) => setFilters({...filters, strainName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4 flex flex-col items-center">
        {/* Logo */}
        <div className="w-full max-w-[40%] aspect-square relative my-8">
          <div className="rounded-full overflow-hidden w-full h-full bg-white shadow-lg">
            <Image
              src="/images/straindog-logo.png"
              alt="Straindog Logo"
              fill
              sizes="(max-width: 768px) 90vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Property Bars */}
        <div className="w-full max-w-3xl space-y-3 mb-8">
          {properties.map((prop) => (
            <button
              key={prop.id}
              onClick={() => setSelectedProperties(prev => 
                prev.includes(prop.id) 
                  ? prev.filter(id => id !== prop.id)
                  : [...prev, prop.id]
              )}
              className={`w-full py-3 px-6 bg-white border-2 ${prop.color} ${
                selectedProperties.includes(prop.id) 
                  ? 'bg-gray-50 shadow-inner' 
                  : 'shadow-md hover:shadow-lg'
              } rounded-lg transition-all flex items-center justify-between`}
            >
              <span className="font-medium text-gray-700">{prop.label}</span>
              {selectedProperties.includes(prop.id) && (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Panel */}
      <AnimatePresence>
        {(searchResults.length > 0 || isSearching) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSearchResults([])}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 bg-white shadow-lg rounded-t-3xl p-4 md:p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} Matching Strains`}
                </h3>
                <button
                  onClick={() => setSearchResults([])}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(strain => (
                  <div key={strain.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">{strain.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{strain.breeder}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>THC: {strain.thc}</span>
                      <span>CBD: {strain.cbd}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
