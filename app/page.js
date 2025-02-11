"use client";
import { useState } from 'react';
import Image from 'next/image';
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
        className="fixed top-0 left-0 right-0 h-[5vh] shadow-lg z-50 
                   flex items-center justify-between px-6"
        style={{
          background: 'linear-gradient(90deg, #8E0365 0%, #E77B05 50%, #1FC55F 100%)'
        }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="object-contain"
          />
          <h1 className="text-white text-xl font-bold">Dr. Cannabis</h1>
          <span className="text-white text-xl font-bold">Samen</span>
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="transition-colors"
          style={{ backgroundColor: 'rgba(0, 102, 102, 0.5)' }}
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
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
                            : 'shadow-md hover:bg-opacity-90 text-[#8E0365]'
                          }`}
                style={{
                  backgroundColor: selectedCategories.includes(category.id) 
                    ? '#8E0365'
                    : 'rgba(33, 178, 199, 0.5)',
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
                className="w-full p-3 rounded-lg focus:ring-2 
                         focus:ring-[#8E0365] focus:border-[#8E0365] outline-none
                         text-white placeholder-white placeholder-opacity-70"
                style={{ 
                  backgroundColor: 'rgba(0, 102, 102, 0.5)',
                  border: '2px solid rgba(0, 102, 102, 0.8)'
                }}
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
