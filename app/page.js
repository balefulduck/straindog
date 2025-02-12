"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SeedListEditor from '../components/SeedListEditor';
import StrainPreview from '../components/StrainPreview';
import Header from '../components/Header';

const categories = [
  { id: 'high-cbd', label: 'Hoher CBD-Gehalt', color: '#EAB404' },
  { id: 'high-thc', label: 'Hoher THC-Gehalt', color: '#E77B05' },
  { id: 'pain', label: 'Schmerzlindernd', color: '#1FC55F' },
  { id: 'sleep', label: 'Schlaffördernd', color: '#EAB404' },
  { id: 'energy', label: 'Stimulierend', color: '#E77B05' }
];

export default function LandingPage() {
  const router = useRouter();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div className="min-h-screen bg-white">
      <Header onEditorOpen={() => setIsEditorOpen(true)} />

      {/* Main Content */}
      <main className="pt-[5vh]">
        {/* Search Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <input
                  type="text"
                  placeholder="Suche nach Sorten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8E0365] focus:border-transparent"
                />
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (selectedCategories.includes(category.id)) {
                        setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                      } else {
                        setSelectedCategories([...selectedCategories, category.id]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategories.includes(category.id)
                        ? 'text-white'
                        : 'text-gray-700 border border-gray-300'
                    }`}
                    style={{
                      backgroundColor: selectedCategories.includes(category.id)
                        ? category.color
                        : 'transparent'
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Alle Sorten Button */}
              <button
                onClick={() => router.push('/grid')}
                className="text-sm px-4 py-2 rounded-full bg-[#8E0365] text-white hover:bg-opacity-90 transition-colors shadow-sm"
              >
                Alle Sorten
              </button>
            </div>
          </div>
        </div>

        {/* Strain Preview */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <StrainPreview searchQuery={searchQuery} selectedCategories={selectedCategories} />
        </div>
      </main>

      <SeedListEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}
