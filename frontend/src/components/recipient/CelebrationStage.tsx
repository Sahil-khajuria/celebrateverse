"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Confetti from "@/components/celebration/Confetti";
import Fireworks from "@/components/celebration/Fireworks";
import PhotoLightbox from "@/components/celebration/PhotoLightbox";
import { engagementApi } from "@/lib/apiEndpoints";
import { Heart, Sparkles, Star, PartyPopper } from "lucide-react";

interface CelebrationStageProps {
  pageData: any;
  isCalmMode: boolean;
  onContinueToCake: () => void;
  slug: string;
}

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=800&q=80",
  "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
  "https://images.unsplash.com/photo-1516997184284-fd3344177d8f?w=800&q=80"
];

const FloatingMemory = ({ src, delay }: { src: string, delay: number }) => {
  return (
    <motion.div
      initial={{ y: "120vh", x: Math.random() * 100 - 50 + "vw", opacity: 0, rotate: -20 }}
      animate={{ 
        y: "-20vh", 
        x: Math.random() * 100 - 50 + "vw",
        opacity: [0, 0.4, 0.4, 0],
        rotate: 20
      }}
      transition={{ 
        duration: 15 + Math.random() * 10, 
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      className="absolute z-0 pointer-events-none rounded-2xl overflow-hidden shadow-2xl border border-white/20 blur-[1px] hover:blur-none transition-all"
      style={{ width: "150px", height: "150px" }}
    >
      <img src={src} className="w-full h-full object-cover" alt="Floating memory" />
    </motion.div>
  );
};

export default function CelebrationStage({ pageData, isCalmMode, onContinueToCake, slug }: CelebrationStageProps) {
  const [likes, setLikes] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const emojis = [
    { icon: <PartyPopper className="w-6 h-6" />, label: "Party" },
    { icon: <Heart className="w-6 h-6" />, label: "Love" },
    { icon: <Star className="w-6 h-6" />, label: "Star" },
    { icon: <Sparkles className="w-6 h-6" />, label: "Sparkles" }
  ];

  const handleLike = () => {
    setLikes(prev => prev + 1);
    engagementApi.logEvent(slug, "LIKE");
  };

  const handleReaction = (emojiLabel: string) => {
    engagementApi.logEvent(slug, "REACTION");
  };

  const calculateAge = () => {
    if (!pageData.recipientBirthday) return "Wishing you an amazing year ahead!";
    const birthDate = new Date(pageData.recipientBirthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `Happy ${age}th Birthday!`;
  };

  // Get media assets, fallback to DEFAULT_PHOTOS if empty
  const rawPhotos = pageData?.mediaAssets?.filter((a: any) => a.type === 'PHOTO').map((a: any) => a.url) || [];
  const photos = rawPhotos.length > 0 ? rawPhotos : DEFAULT_PHOTOS;
  const lightboxPhotos = pageData?.photos?.length > 0 ? pageData.photos : photos;

  // Timelines
  const timelines = pageData?.mediaAssets?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-24 px-4 md:px-8 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none z-0" />
      
      {!isCalmMode && <Confetti isActive={true} mode="rain" />}
      {!isCalmMode && showFireworks && <Fireworks isActive={true} />}
      {!isCalmMode && showConfetti && <Confetti isActive={true} mode="explosion" />}

      {/* Floating Memories Background */}
      {!isCalmMode && photos.map((src: string, i: number) => (
        <FloatingMemory key={`float-${i}`} src={src} delay={i * 2.5} />
      ))}

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 flex flex-col items-center text-center mt-12 mb-24 max-w-4xl"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-6 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-indigo-300 font-medium tracking-widest uppercase text-sm"
        >
          {calculateAge()}
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-white to-purple-400 mb-8 drop-shadow-2xl tracking-tight">
          Celebrate <br/> {pageData.recipientName}
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed">
          &quot;{pageData.personalMessage || 'Wishing you the best day ever!'}&quot;
          <span className="block mt-4 text-indigo-400 font-medium">— {pageData.senderName}</span>
        </p>
      </motion.div>

      {/* Interactive Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap justify-center gap-4 mb-32 z-10"
      >
        <button 
          onClick={handleLike} 
          className="group flex items-center gap-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 px-8 py-4 rounded-full backdrop-blur-xl transition-all border border-pink-500/20 hover:border-pink-500/40 hover:scale-105 active:scale-95"
        >
          <Heart className={`w-5 h-5 ${likes > 0 ? "fill-pink-400 text-pink-400" : ""}`} /> 
          <span className="font-semibold text-lg">{likes}</span>
        </button>
        
        <div className="flex gap-2 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10">
          {emojis.map(e => (
            <motion.button 
              key={e.label} 
              whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }} 
              onClick={() => handleReaction(e.label)}
              className="p-3 rounded-full text-indigo-300 transition-colors"
            >
              {e.icon}
            </motion.button>
          ))}
        </div>
        
        {!isCalmMode && (
          <button 
            onClick={() => { setShowFireworks(true); setTimeout(() => setShowFireworks(false), 5000); }} 
            className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-8 py-4 rounded-full backdrop-blur-xl transition-all border border-indigo-500/20 hover:border-indigo-500/40 hover:scale-105 active:scale-95 font-semibold text-lg"
          >
            <Sparkles className="w-5 h-5" /> Launch Magic
          </button>
        )}
      </motion.div>

      {/* Masonry Gallery */}
      <div className="w-full max-w-7xl z-10 mb-32 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Beautiful Memories</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {photos.map((photo: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.9, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.15 }}
              className="break-inside-avoid relative group cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img 
                  src={photo} 
                  alt="Memory" 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-medium text-sm drop-shadow-md flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Expand
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory Timeline */}
      {timelines.length > 0 && (
        <div className="w-full max-w-4xl z-10 mb-40">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Journey</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-400 mx-auto rounded-full" />
          </div>
          
          <div className="relative border-l-2 border-indigo-500/30 ml-4 md:ml-12 pl-8 md:pl-12 space-y-24">
            {timelines.map((item: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -left-[41px] md:-left-[57px] top-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-950 border-4 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)] z-10" />
                
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl hover:bg-white/10 transition-colors">
                  {item.type === 'PHOTO' ? (
                    <img src={item.url} className="w-full max-h-96 object-cover rounded-xl mb-6 shadow-lg" alt="Timeline moment" />
                  ) : item.type === 'VIDEO' ? (
                    <video src={item.url} className="w-full max-h-96 object-cover rounded-xl mb-6 shadow-lg" controls />
                  ) : (
                    <div className="w-full h-40 bg-indigo-900/30 rounded-xl mb-6 flex items-center justify-center">
                      <Star className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}
                  <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                    {item.description || "A beautiful moment captured in time."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinueToCake}
        className="fixed bottom-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(99,102,241,0.4)] z-40 flex items-center gap-4 border border-white/20 transition-all overflow-hidden group"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
        <span className="text-3xl group-hover:rotate-12 transition-transform">🎂</span> 
        <span>Blow Out the Candles</span>
      </motion.button>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox 
            photos={lightboxPhotos} 
            initialIndex={lightboxIndex} 
            onClose={() => setLightboxIndex(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
