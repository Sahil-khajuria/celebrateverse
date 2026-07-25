"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/celebration/Confetti";
import { engagementApi } from "@/lib/apiEndpoints";
import { Maximize, Minimize, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface SurpriseRevealProps {
  pageData: any;
  isCalmMode: boolean;
  slug: string;
  slideshowSongUrl?: string;
  onComplete?: () => void;
  onSlideTypeChange?: (type: string) => void;
}

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=1600&q=80",
  "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=1600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80"
];

export default function SurpriseReveal({ pageData, isCalmMode, slug, slideshowSongUrl, onComplete, onSlideTypeChange }: SurpriseRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideshowAudioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slideshow background music
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slideshowSongUrl && slideshowAudioRef.current) {
      const audio = slideshowAudioRef.current;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      
      if (isPlaying && slides[currentIndex]?.type !== 'voice') {
        if (audio.paused) {
          audio.volume = 0;
          audio.play().catch(() => {});
        }
        let vol = audio.volume;
        fadeIntervalRef.current = setInterval(() => {
          vol = Math.min(1, vol + 0.05);
          audio.volume = vol;
          if (vol >= 1 && fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }, 50);
      } else {
        let vol = audio.volume;
        fadeIntervalRef.current = setInterval(() => {
          vol = Math.max(0, vol - 0.05);
          audio.volume = vol;
          if (vol <= 0) {
            audio.pause();
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          }
        }, 50);
      }
    }
  }, [slideshowSongUrl, isPlaying, currentIndex]);

  useEffect(() => {
    if (onSlideTypeChange) {
      onSlideTypeChange(slides[currentIndex]?.type || '');
    }
  }, [currentIndex, onSlideTypeChange]);
  
  const SLIDE_DURATION = 6000;

  // Process mediaAssets
  const mediaAssets = pageData?.mediaAssets || [];
  let photos = mediaAssets.filter((a: any) => a.type === 'PHOTO').map((a: any) => a.url);
  if (photos.length === 0) {
    photos = DEFAULT_PHOTOS;
  }
  const videos = mediaAssets.filter((a: any) => a.type === 'VIDEO').map((a: any) => a.url);
  const voiceNotes = mediaAssets.filter((a: any) => a.type === 'VOICE_NOTE').map((a: any) => a.url);

  const slides = [
    ...photos.map((url: string, i: number) => ({ type: 'photo', url, caption: `Memory ${i + 1} ✨` })),
    ...videos.map((url: string) => ({ type: 'video', url })),
    {
      type: 'letter',
      message: pageData?.personalMessage || 'Happy Birthday! Wishing you a day filled with joy and happiness.',
      sender: pageData?.senderName || 'Someone Special',
    },
    ...voiceNotes.map((url: string) => ({ type: 'voice', url })),
    { type: 'final' },
  ];

  const slide = slides[currentIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return 0;
      if (nextIndex >= slides.length) return slides.length - 1;
      return nextIndex;
    });
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    engagementApi.logEvent(slug, 'REPLAY');
    setDirection(-1);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Autoplay Logic
  useEffect(() => {
    if (!isPlaying) return;
    if (slide?.type === 'video' || slide?.type === 'voice' || slide?.type === 'final') return;

    const timer = setTimeout(() => {
      if (currentIndex < slides.length - 1) {
        paginate(1);
      }
    }, SLIDE_DURATION);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, slide?.type, slides.length]);

  // Media Autoplay
  useEffect(() => {
    if (slide?.type === 'voice' && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    if (slide?.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [currentIndex, slide?.type]);

  // Swipe Gestures
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      if (currentIndex < slides.length - 1) paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      if (currentIndex > 0) paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0, scale: 0.9 }),
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      {/* Slideshow Song */}
      {slideshowSongUrl && <audio ref={slideshowAudioRef} src={slideshowSongUrl} loop />}
      
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-2 w-full max-w-lg mx-auto">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 flex-1 ${
                i === currentIndex ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : i < currentIndex ? "bg-white/60" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 text-white ml-8">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white/80 hover:text-white"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white/80 hover:text-white"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); paginate(-1); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-black/50 border border-white/10 rounded-full text-white backdrop-blur-lg transition-all opacity-0 hover:opacity-100 sm:opacity-100"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      
      {currentIndex < slides.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); paginate(1); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-black/50 border border-white/10 rounded-full text-white backdrop-blur-lg transition-all opacity-0 hover:opacity-100 sm:opacity-100"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onClick={() => {
            if (currentIndex < slides.length - 1) paginate(1);
          }}
        >
          {slide.type === 'photo' && (
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
              {/* Ken Burns Effect Image */}
              <motion.img
                initial={{ scale: 1, x: 0 }}
                animate={{ scale: 1.15, x: direction === 1 ? -20 : 20 }}
                transition={{ duration: SLIDE_DURATION / 1000 + 2, ease: "linear" }}
                src={slide.url}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                alt="Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              <div className="relative z-10 p-6 pb-20 md:p-8 bg-white shadow-2xl max-w-2xl w-[90%] transform -rotate-2">
                <img src={slide.url} className="w-full h-auto max-h-[65vh] object-cover border border-gray-200" alt="Memory" />
                <p className="mt-8 font-serif text-2xl text-gray-800 text-center italic">{slide.caption}</p>
              </div>
            </div>
          )}

          {slide.type === 'video' && (
            <div 
              className="relative w-full h-full bg-black flex items-center justify-center" 
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current && videoRef.current.muted) {
                  videoRef.current.muted = false;
                }
              }}
            >
              <video
                ref={videoRef}
                src={slide.url}
                controls
                playsInline
                autoPlay
                className="w-full h-full object-contain transition-opacity duration-1000"
                onEnded={() => { if (currentIndex < slides.length - 1) paginate(1); }}
              />
            </div>
          )}

          {slide.type === 'letter' && (
            <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10 bg-amber-50/95 backdrop-blur-xl w-full max-w-3xl p-12 md:p-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-amber-200/50 rounded-lg text-center"
              >
                <div className="w-16 h-1 bg-amber-300 mx-auto mb-10 rounded-full" />
                <h3 className="text-3xl md:text-5xl font-serif text-slate-800 mb-10 tracking-tight">
                  Dear {pageData?.recipientName},
                </h3>
                <p className="font-serif text-xl md:text-3xl leading-relaxed text-slate-700 whitespace-pre-wrap italic mb-16">
                  &quot;{slide.message}&quot;
                </p>
                <div className="text-center">
                  <p className="font-serif text-xl text-slate-500 uppercase tracking-widest mb-4">With love</p>
                  <p className="font-serif text-4xl text-slate-900 font-bold">{slide.sender}</p>
                </div>
              </motion.div>
            </div>
          )}

          {slide.type === 'voice' && (
            <div className="w-full h-full relative bg-indigo-950 flex flex-col items-center justify-center p-6" onClick={e => e.stopPropagation()}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/50 to-indigo-950" />
              
              <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)] mb-12"
                >
                  <Play className="w-12 h-12 text-white fill-white ml-2" />
                </motion.div>
                
                <h2 className="text-4xl text-white font-bold mb-4 font-serif">Voice Message</h2>
                <p className="text-indigo-200 text-lg mb-12 font-light tracking-wide">From {pageData?.senderName}</p>
                
                <audio ref={audioRef} src={slide.url} controls className="w-full" onEnded={() => { if (currentIndex < slides.length - 1) paginate(1); }} />
                
                <div className="flex justify-center gap-2 h-16 items-end mt-12 w-full px-8">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', `${40 + Math.random() * 60}%`, '20%'] }}
                      transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex-1 bg-gradient-to-t from-pink-500 to-indigo-400 rounded-t-full opacity-70"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {slide.type === 'final' && (
            <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-center text-center p-6" onClick={e => e.stopPropagation()}>
              {!isCalmMode && <Confetti isActive mode="explosion" />}
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                className="relative z-10 max-w-4xl flex flex-col items-center"
              >
                <div className="text-8xl mb-8">✨</div>
                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 mb-8 drop-shadow-[0_0_30px_rgba(192,132,252,0.3)]">
                  Happy Birthday
                </h1>
                <p className="text-2xl md:text-4xl text-slate-300 font-serif italic mb-16">
                  You are deeply loved.
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleReplay}
                    className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white text-xl font-medium flex items-center gap-4 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-700" />
                    <span>Replay</span>
                  </button>
                  {onComplete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onComplete(); }}
                      className="group px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-full text-white text-xl font-bold flex items-center gap-4 transition-all hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
                    >
                      <span>Read Personal Message / Celebration</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
