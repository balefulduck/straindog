"use client";
import { useState } from 'react';
import ProductShowcase from '../components/ProductShowcase';
import SeedListEditor from '../components/SeedListEditor';

const categories = [
  { id: 'high-cbd', label: 'High CBD', color: '#EAB404' },
  { id: 'high-thc', label: 'High THC', color: '#E77B05' },
  { id: 'pain', label: 'Schmerzen', color: '#1FC55F' },
  { id: 'sleep', label: 'Schlafen', color: '#EAB404' },
  { id: 'relax', label: 'Entspannung', color: '#1FC55F' },
  { id: 'energy', label: 'Anregung', color: '#E77B05' }
];

export default function LandingPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <header 
        className="fixed top-0 left-0 right-0 h-[5vh] bg-[#8E0365] shadow-lg z-50 
                   flex items-center justify-between px-6"
      >
        <h1 className="text-white text-xl font-bold">Dr. Cannabis</h1>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="px-4 py-1 bg-white text-[#8E0365] rounded-full text-sm 
                     hover:bg-opacity-90 transition-colors"
        >
          Edit Seeds
        </button>
      </header>

      {/* Main Content */}
      <div className="pt-[5vh] flex flex-col md:flex-row min-h-[95vh]">
        {/* Left Side - Categories */}
        <div className="w-full md:w-1/2 p-6 bg-gray-50">
          <div className="max-w-md mx-auto space-y-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategories(prev => 
                  prev.includes(category.id)
                    ? prev.filter(id => id !== category.id)
                    : [...prev, category.id]
                )}
                className={`w-full p-4 rounded-lg transition-all flex items-center justify-between
                          ${selectedCategories.includes(category.id)
                            ? 'bg-[#8E0365] text-white shadow-inner'
                            : 'bg-white hover:bg-opacity-90 text-[#8E0365] shadow-md'
                          }`}
                style={{
                  borderLeft: `6px solid ${category.color}`
                }}
              >
                <span className="font-medium">{category.label}</span>
                {selectedCategories.includes(category.id) && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Search and Showcase */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* Search Section */}
          <div className="p-6 border-b">
            <div className="max-w-md mx-auto">
              <label 
                htmlFor="search" 
                className="block text-[#8E0365] font-medium mb-2 text-center"
              >
                Suche
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border-2 border-[#8E0365] rounded-lg focus:ring-2 
                         focus:ring-[#8E0365] focus:border-[#8E0365] outline-none"
                placeholder="Suche nach Strain oder Breeder..."
              />
            </div>
          </div>

          {/* Minimized ProductShowcase */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <ProductShowcase 
                minimal={true}
                searchQuery={searchQuery}
                selectedCategories={selectedCategories}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SeedListEditor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#8E0365]">Edit Seeds</h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <SeedListEditor onClose={() => setIsEditorOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
