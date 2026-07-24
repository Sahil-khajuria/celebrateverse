"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoLightboxProps {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleZoom = () => {
    setScale((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center touch-none"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl z-10 p-2 hover:opacity-75">
        &times;
      </button>

      <div className="absolute top-6 left-6 text-white/70 font-mono tracking-widest z-10 bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {photos.length}
      </div>

      <button onClick={handlePrev} className="absolute left-4 md:left-12 text-white text-5xl z-10 p-4 hover:scale-110 transition-transform">
        &#8249;
      </button>
      <button onClick={handleNext} className="absolute right-4 md:right-12 text-white text-5xl z-10 p-4 hover:scale-110 transition-transform">
        &#8250;
      </button>

      <div 
        className="w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={handleZoom}
        style={{ cursor: scale === 1 ? 'zoom-in' : 'zoom-out' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={photos[currentIndex]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: scale }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            drag={scale > 1}
            dragConstraints={{ top: -100, bottom: 100, left: -100, right: 100 }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
