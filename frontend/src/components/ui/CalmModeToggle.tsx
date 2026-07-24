"use client";
import { motion } from "framer-motion";

interface CalmModeToggleProps {
  isCalmMode: boolean;
  onToggle: () => void;
}

export default function CalmModeToggle({ isCalmMode, onToggle }: CalmModeToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onToggle}
      className="fixed top-6 right-6 z-[100] bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all shadow-lg"
    >
      <span className="text-lg">{isCalmMode ? "🧘" : "🎉"}</span>
      <span className="hidden sm:inline">{isCalmMode ? "Calm Mode" : "Full Mode"}</span>
    </motion.button>
  );
}
