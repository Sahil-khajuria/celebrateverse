'use client'
import React from 'react';
import { motion } from 'framer-motion';

export default function ModeSelector({ selectedMode, onSelect }: any) {
  const modes = [
    { id: 'quick', icon: '⚡', title: 'Quick Wish', desc: 'Go from zero to beautiful in 30 seconds.', time: '~30 seconds', features: ['Instant generation', 'Premium defaults', 'Beautiful animations'] },
    { id: 'personalized', icon: '💝', title: 'Personalized Wish', desc: 'Add a name, photo, and personal message.', time: '~2 minutes', features: ['Custom name & photo', 'Personal message', 'Theme selection'], popular: true },
    { id: 'premium', icon: '👑', title: 'Premium Wish', desc: 'Full media gallery, custom music, and more.', time: '~5 minutes', features: ['Photo gallery', 'Custom music', 'Video message'] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-4">
      {modes.map((mode, i) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(mode.id)}
          className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${selectedMode === mode.id ? 'border-pink-500 bg-white/10 scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/30'}`}
        >
          {mode.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Most Popular</div>}
          <div className="text-4xl mb-4">{mode.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
          <span className="inline-block bg-white/10 text-white/80 text-xs px-2 py-1 rounded mb-4">{mode.time}</span>
          <p className="text-gray-300 text-sm mb-6 h-12">{mode.desc}</p>
          <ul className="space-y-2 mb-6">
            {mode.features.map(f => (
              <li key={f} className="text-sm text-gray-400 flex items-center gap-2">
                <span className="text-pink-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className={`w-full text-center py-3 rounded-xl font-bold transition-colors ${selectedMode === mode.id ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            Select →
          </div>
        </motion.div>
      ))}
    </div>
  );
}
