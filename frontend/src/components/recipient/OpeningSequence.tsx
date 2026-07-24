"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterText from "@/components/celebration/TypewriterText";
import StarField from "@/components/celebration/StarField"; // Assume exists

interface OpeningSequenceProps {
  recipientName: string;
  onComplete: () => void;
}

export default function OpeningSequence({ recipientName, onComplete }: OpeningSequenceProps) {
  const [showButton, setShowButton] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const text = `Someone has prepared something very special just for you, ${recipientName}...`;

  useEffect(() => {
    if (showButton) {
      const timer = setTimeout(() => setShowSkip(true), 7000);
      return () => clearTimeout(timer);
    }
  }, [showButton]);

  const handleOpen = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.5, filter: "brightness(2)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <StarField />
          
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20 text-2xl"
                initial={{ 
                  y: "110vh", 
                  x: `${Math.random() * 100}vw`,
                  opacity: 0,
                  rotate: 0 
                }}
                animate={{ 
                  y: "-10vh",
                  opacity: [0, 0.5, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 10 + Math.random() * 15, 
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              >
                ♪
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 px-6 max-w-2xl text-center">
            <h1 className="text-2xl md:text-4xl text-white font-light leading-relaxed tracking-wide min-h-[120px]">
              <TypewriterText 
                text={text} 
                speed={50} 
                onComplete={() => setShowButton(true)} 
              />
            </h1>

            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="mt-12"
                >
                  <button
                    onClick={handleOpen}
                    className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-lg md:text-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10">✨ Open Your Birthday Surprise ✨</span>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/20"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleOpen}
                className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors"
              >
                Skip 
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
