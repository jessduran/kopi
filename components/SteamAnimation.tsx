
import React from 'react';

const SteamAnimation: React.FC = () => {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex space-x-2 pointer-events-none opacity-40">
      <div className="w-1 h-8 bg-white/30 rounded-full animate-pulse [animation-delay:0.2s] blur-md"></div>
      <div className="w-1 h-12 bg-white/30 rounded-full animate-pulse [animation-delay:0.5s] blur-md"></div>
      <div className="w-1 h-10 bg-white/30 rounded-full animate-pulse [animation-delay:0.8s] blur-md"></div>
    </div>
  );
};

export default SteamAnimation;
