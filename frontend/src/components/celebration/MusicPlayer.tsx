'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Repeat, Repeat1, X, Music } from 'lucide-react'

interface MusicPlayerProps {
  src?: string
  slideshowSongUrl?: string
  stage: string
  isVoiceActive?: boolean
}

const DEFAULT_SONG = 'https://cdn.pixabay.com/audio/2024/03/13/audio_9e4f17b89e.mp3'

export default function MusicPlayer({ src, slideshowSongUrl, stage, isVoiceActive }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [volume, setVolume] = useState(45)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoop, setIsLoop] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [bars, setBars] = useState<number[]>(Array(16).fill(15))
  
  // Progress state
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animRef = useRef<number>(0)
  const songUrl = src || DEFAULT_SONG

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Fade Audio Utility
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fadeAudio = (targetVolume: number, durationMs = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = (targetVolume - startVolume) / steps;
    
    let currentStep = 0;
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        const newVol = startVolume + (volumeStep * currentStep);
        audio.volume = Math.max(0, Math.min(1, newVol));
      }
    }, stepTime);
  }

  useEffect(() => {
    const audio = new Audio(songUrl)
    audio.loop = isLoop
    audio.volume = 0 // start at 0 for fade in
    audioRef.current = audio

    const animateBars = () => {
      if (!audio.paused && !isDragging) {
        setBars(prev => prev.map(() => 15 + Math.random() * 85))
      } else {
        setBars(Array(16).fill(15))
      }
      animRef.current = requestAnimationFrame(animateBars)
    }
    animRef.current = requestAnimationFrame(animateBars)

    // Time update listener
    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime)
      }
    }
    const updateDuration = () => setDuration(audio.duration)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    let playOnInteract: (() => void) | null = null;

    const tryAutoPlay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        setHasInteracted(true)
        fadeAudio(volume / 100, 2000) // 2 second fade in
      } catch {
        // Blocked by browser
        audio.volume = 0; // set normal volume for manual play
        
        playOnInteract = () => {
          if (!audio.paused) return; // already playing
          audio.play().then(() => {
            setIsPlaying(true)
            setHasInteracted(true)
            fadeAudio(volume / 100, 2000)
          }).catch(() => {})
          
          window.removeEventListener('click', playOnInteract!, true)
          window.removeEventListener('touchstart', playOnInteract!, true)
          window.removeEventListener('keydown', playOnInteract!, true)
        }

        window.addEventListener('click', playOnInteract, { once: true, capture: true })
        window.addEventListener('touchstart', playOnInteract, { once: true, capture: true })
        window.addEventListener('keydown', playOnInteract, { once: true, capture: true })
      }
    }
    tryAutoPlay()

    return () => {
      if (playOnInteract) {
        window.removeEventListener('click', playOnInteract, true)
        window.removeEventListener('touchstart', playOnInteract, true)
        window.removeEventListener('keydown', playOnInteract, true)
      }
      cancelAnimationFrame(animRef.current)
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.pause()
      audio.src = ''
    }
  }, [songUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = isLoop
  }, [isLoop])

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted, isPlaying])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true)
        setHasInteracted(true)
        fadeAudio(isMuted ? 0 : volume / 100, 1000)
      }).catch(() => {})
    } else {
      fadeAudio(0, 500)
      setTimeout(() => {
        audio.pause();
        setIsPlaying(false)
      }, 500);
    }
  }, [volume, isMuted])

  const handlePillClick = () => {
    if (!hasInteracted) {
      togglePlay()
    }
    setIsMinimized(false)
  }

  // Audio Manager Logic
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const shouldPlayBGM = !isVoiceActive && (stage !== 'reveal' || !slideshowSongUrl);
    
    if (!shouldPlayBGM) {
      fadeAudio(0, 500);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      }, 500);
    } else {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      if (hasInteracted && audio.paused && !isPlaying) {
        audio.currentTime = 0;
        audio.play().then(() => {
          setIsPlaying(true);
          fadeAudio(isMuted ? 0 : volume / 100, 1500);
        }).catch(() => {});
      }
    }
  }, [stage, slideshowSongUrl, isVoiceActive, hasInteracted])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="pill"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            onClick={handlePillClick}
            className="fixed bottom-6 left-6 z-50 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 cursor-pointer flex items-center gap-4 hover:bg-black/80 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-end gap-[3px] h-6">
              {bars.slice(0, 10).map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-t-sm transition-all duration-100"
                  style={{
                    height: `${isPlaying ? h : 15}%`,
                    background: isPlaying ? `hsl(${320 + i * 8}, 80%, 65%)` : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
            <span className="text-white/90 text-sm font-semibold tracking-wide flex items-center gap-2">
              {hasInteracted ? (isPlaying ? 'Playing Music' : 'Paused') : <><Play className="w-4 h-4"/> Start Music</>}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed bottom-6 left-6 z-50 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-[340px] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Birthday Soundtrack</h3>
                  <p className="text-indigo-300/70 text-xs tracking-wider uppercase">{isPlaying ? 'Now Playing' : 'Paused'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visualizer */}
            <div className="flex items-end justify-between h-12 mb-6 bg-black/40 rounded-xl px-4 py-2 border border-white/5 overflow-hidden">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t-md transition-all duration-100"
                  style={{
                    height: `${isPlaying ? h : 10}%`,
                    background: `linear-gradient(to top, hsl(${280 + i * 5}, 70%, 60%), hsl(${320 + i * 5}, 80%, 70%))`,
                  }}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onChange={handleSeek}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                style={{ 
                  background: `linear-gradient(to right, #ec4899 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%)` 
                }}
              />
              <div className="flex justify-between mt-2 text-xs font-medium text-white/50">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setIsLoop(!isLoop)}
                className={`p-3 rounded-full transition-all ${isLoop ? 'text-pink-400 bg-pink-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {isLoop ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>

              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-shadow"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
              </motion.button>

              <div className="relative group p-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                {/* Volume slider popup on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-8 h-24 bg-slate-800 rounded-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col items-center justify-center py-2 shadow-xl border border-white/10">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    orient="vertical"
                    value={isMuted ? 0 : volume}
                    onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false) }}
                    className="w-1 h-20 accent-pink-500 cursor-pointer appearance-none bg-slate-700 rounded-full"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' } as any}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
