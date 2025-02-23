"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

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
    </header>
  );
};

export default Header;
