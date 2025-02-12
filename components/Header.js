"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = ({ onEditorOpen }) => {
  const router = useRouter();

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-[5vh] shadow-lg z-50 
                 flex items-center justify-between px-6"
      style={{
        background: 'linear-gradient(90deg, #8E0365 0%, #E77B05 50%, #1FC55F 100%)'
      }}
    >
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push('/')}
      >
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
      {onEditorOpen && (
        <button
          onClick={onEditorOpen}
          className="p-2 rounded-full transition-colors"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
