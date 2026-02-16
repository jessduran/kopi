
import React from 'react';
import { Letter } from '../types';

interface LetterCardProps {
  letter: Letter;
}

const WatercolorCoffeeArt: React.FC = () => (
  <div className="absolute top-[-20px] left-[-20px] w-48 h-48 opacity-20 pointer-events-none select-none z-0">
    {/* Watercolor heart shape using blurred blobs */}
    <div className="absolute top-10 left-10 w-24 h-24 bg-[#8d6e63] rounded-full blur-[40px] mix-blend-multiply"></div>
    <div className="absolute top-14 left-4 w-20 h-20 bg-[#3e2723] rounded-full blur-[35px] mix-blend-multiply"></div>
    <div className="absolute top-6 left-16 w-16 h-16 bg-[#d7ccc8] rounded-full blur-[25px] mix-blend-multiply"></div>
    {/* SVG heart outline with watercolor brush feel */}
    <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full text-[#3e2723]/10">
      <path 
        fill="currentColor" 
        d="M50 88.3L42.8 81.8C17.1 58.5 0 43 0 24.2C0 10.8 10.5 0 23.8 0C31.3 0 38.5 3.5 43.1 9C47.7 3.5 54.9 0 62.4 0C75.7 0 86.2 10.8 86.2 24.2C86.2 43 69.1 58.5 43.4 81.9L50 88.3Z"
        transform="translate(7, 7) scale(0.9)"
      />
    </svg>
  </div>
);

const LetterCard: React.FC<LetterCardProps> = ({ letter }) => {
  const getPaperStyle = () => {
    switch (letter.paperType) {
      case 'napkin':
        return 'bg-white border-dashed border-gray-200 shadow-sm font-mono rotate-1';
      case 'parchment':
        return 'bg-[#fcf5e5] border-solid border-[#e5d5b5] shadow-md -rotate-1 font-serif';
      default:
        return 'bg-white border-solid border-gray-100 shadow-sm font-sans';
    }
  };

  return (
    <div className={`p-10 mb-10 relative transition-all hover:translate-y-[-2px] max-w-2xl mx-auto border ${getPaperStyle()} ring-1 ring-black/5 overflow-hidden`}>
      {/* Subtle paper fiber texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
      
      {/* Coffee Watercolor Art for Anniversary Special */}
      {letter.isSpecial && <WatercolorCoffeeArt />}
      
      {/* Decorative coffee stain ring for character */}
      {letter.isSpecial && (
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full border-[1px] border-[#3e2723]/10 opacity-30 pointer-events-none rotate-45 scale-150 ring-[15px] ring-transparent ring-inset border-t-transparent border-l-transparent"></div>
      )}
      
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1 font-bold">To</p>
          <h3 className="text-2xl font-serif italic text-gray-900">{letter.recipient}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-mono">{letter.date}</p>
          <p className="text-[9px] uppercase tracking-widest text-amber-800 mt-1 px-2 py-0.5 bg-amber-50 rounded-full inline-block">{letter.mood.split('(')[0]}</p>
        </div>
      </div>
      
      <div className="whitespace-pre-wrap text-gray-800 leading-[1.8] min-h-[120px] text-lg relative z-10">
        {letter.content}
      </div>
      
      <div className="mt-10 pt-6 flex justify-between items-center relative z-10">
        <div className="w-8 h-px bg-gray-200"></div>
        <span className="text-[10px] uppercase tracking-widest text-gray-300 italic">
          {letter.isSpecial ? 'With all my heart' : 'Fin.'}
        </span>
      </div>
    </div>
  );
};

export default LetterCard;
