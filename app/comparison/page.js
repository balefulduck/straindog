"use client";
import { useComparison } from '@/context/ComparisonContext';
import { useRouter } from 'next/navigation';

export default function ComparisonPage() {
  const { comparisonStrains, clearComparison } = useComparison();
  const router = useRouter();

  const handleClearAndReturn = () => {
    clearComparison();
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 pt-[10vh]">
      <div className="grid grid-cols-2 gap-4">
        {comparisonStrains.map((strain, index) => (
          <div key={strain.id} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-2">{strain.title}</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Breeder:</div>
              <div>{strain.breeder}</div>
              <div className="font-semibold">Type:</div>
              <div>{strain.seedType}</div>
              <div className="font-semibold">Categories:</div>
              <div>{strain.categories?.join(', ')}</div>
            </div>
            <p className="mt-4 text-gray-600">{strain.description}</p>
          </div>
        ))}
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center">
          <button
            onClick={handleClearAndReturn}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Clear Comparison & Return
          </button>
          <p className="mt-4 text-gray-600 text-center">
            Clear your current strain selection and return to the main page
          </p>
        </div>
      </div>
    </div>
  );
}
