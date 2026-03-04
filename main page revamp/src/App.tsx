import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 font-sans transition-colors duration-500 bg-[#E4E3E0] text-[#141414]">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase m-0"
        >
          Product<br />Manager
        </motion.h1>
        
      </div>

      {/* Middle Section - URL Input */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto my-16 z-10"
      >
        <form 
          onSubmit={(e) => e.preventDefault()} 
          className="w-full relative group"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ENTER URL LINK..."
            className="w-full bg-transparent border-b-4 border-[#141414] text-lg md:text-xl py-4 md:py-8 outline-none placeholder:text-[#141414]/30 font-black tracking-tighter uppercase transition-all focus:border-[#F27D26]"
            required
          />
          <button 
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 md:w-24 md:h-24 bg-[#141414] text-[#E4E3E0] rounded-full flex items-center justify-center hover:bg-[#F27D26] hover:text-white transition-colors group-focus-within:bg-[#F27D26] group-focus-within:text-white"
          >
            <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>
        </form>
      </motion.div>

      {/* Bottom Section */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-end gap-8 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-sm text-lg md:text-xl font-medium leading-snug text-justify md:pb-4"
        >
          Learn PM Insights & Advanced English from YouTube Videos
        </motion.div>
        
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase m-0 text-right"
          >
            English
          </motion.h1>
          
          {/* Decorative SVG */}
          <motion.svg 
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 0.7, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -top-16 -left-8 md:-top-24 md:-left-16 w-20 h-20 md:w-32 md:h-32 animate-[spin_15s_linear_infinite] pointer-events-none" 
            viewBox="0 0 68 68" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="currentColor" strokeWidth="1">
              <path d="M34 0V68"></path>
              <path d="M68 34H0"></path>
              <path d="M25.2876 1.13379L42.706 66.865"></path>
              <path d="M66.8651 25.2908L1.13477 42.7092"></path>
              <path d="M43.0516 1.22656L24.9492 66.7736"></path>
              <path d="M66.7736 43.0512L1.22656 24.9487"></path>
              <path d="M51.4533 4.81885L16.5557 63.1812"></path>
              <path d="M63.1821 51.4489L4.81982 16.5513"></path>
              <path d="M58.0607 9.9751L9.94385 58.0248"></path>
              <path d="M58.0228 58.0585L9.97314 9.94165"></path>
              <path d="M63.1397 16.4749L4.86816 51.524"></path>
              <path d="M51.5228 63.1358L16.4736 4.86426"></path>
            </g>
          </motion.svg>
        </div>
      </div>
    </div>
  );
}
