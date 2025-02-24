"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GiSeedling } from 'react-icons/gi';

const Header = () => {
  const router = useRouter();
  const { comparisonStrains } = useComparison();
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastAction, setLastAction] = useState({ type: null, index: null });

  // Show tooltip when first strain is added
  useEffect(() => {
    if (comparisonStrains.length === 1) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [comparisonStrains.length]);

  // Track changes to comparison strains
  useEffect(() => {
    const prevLength = lastAction.prevLength || 0;
    if (comparisonStrains.length > prevLength) {
      setLastAction({ 
        type: 'add', 
        index: comparisonStrains.length - 1,
        prevLength: comparisonStrains.length 
      });
    } else if (comparisonStrains.length < prevLength) {
      setLastAction({ 
        type: 'remove', 
        index: prevLength - 1,
        prevLength: comparisonStrains.length 
      });
    }
  }, [comparisonStrains.length]);

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

      <div className="relative">
        <div 
          className="flex gap-2 cursor-pointer" 
          onClick={() => comparisonStrains.length > 0 && router.push('/comparison')}
        >
          <AnimatePresence>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: lastAction.index === index ? [1, 1.2, 1] : 1,
                  rotate: lastAction.index === index ? [0, -5, 5, 0] : 0
                }}
                transition={{ 
                  scale: { duration: 0.3 },
                  rotate: { duration: 0.3 }
                }}
                exit={{ x: -50, opacity: 0 }}
                className={`w-12 h-8 rounded border-2 border-white flex items-center justify-center
                          transition-all duration-200 ${
                  comparisonStrains[index] 
                    ? 'bg-white bg-opacity-20 backdrop-blur-sm' 
                    : 'bg-transparent'
                } ${
                  lastAction.index === index ? 'ring-2 ring-white ring-opacity-50' : ''
                }`}
              >
                {comparisonStrains[index] && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ 
                      scale: 1,
                      rotate: -45,
                    }}
                    exit={{ scale: 0, rotate: 45 }}
                  >
                    <GiSeedling className="text-white text-lg" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-3 text-sm whitespace-nowrap"
            >
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45" />
              <span className="text-gray-700">Klicken für Vergleichsseite</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
