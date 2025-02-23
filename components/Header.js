"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const router = useRouter();
  const { comparisonStrains } = useComparison();

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-[5vh] shadow-lg z-50 
                 flex items-center justify-between px-6"
      style={{
        background: 'linear-gradient(90deg, #738728 0%, #AEBC16  100%)'
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

      <div 
        className="flex gap-2 cursor-pointer" 
        onClick={() => comparisonStrains.length > 0 && router.push('/comparison')}
      >
        <AnimatePresence>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className={`w-12 h-8 rounded border-2 border-white ${
                comparisonStrains[index] 
                  ? 'bg-white bg-opacity-20' 
                  : 'bg-transparent'
              }`}
            >
              {comparisonStrains[index] && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xs">
                    {comparisonStrains[index].title.substring(0, 3)}...
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
