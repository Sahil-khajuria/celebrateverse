'use client'
import React, { useEffect, useState } from 'react';

export default function BlowDetector({ onBlow, isDisabled }: any) {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(e.code === 'Space' && !isDisabled) onBlow();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDisabled, onBlow]);

  return (
    <div className="flex flex-col items-center gap-4 z-20">
      <p className="text-gray-400 text-sm">Press Space or blow into mic</p>
      <button 
        disabled={isDisabled}
        onClick={() => {
            setListening(true);
            setTimeout(() => { setListening(false); onBlow(); }, 1000);
        }}
        className="px-6 py-2 border border-white/30 rounded-full text-white hover:bg-white/10 transition"
      >
        {listening ? 'Listening...' : 'Enable Mic'}
      </button>
    </div>
  );
}
