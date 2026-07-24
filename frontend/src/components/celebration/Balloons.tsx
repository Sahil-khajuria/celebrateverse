'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BalloonsProps {
  recipientName?: string
  photos?: string[]
}

const BALLOON_COLORS = [
  '#FF6B9D', '#C44AFF', '#FFD700', '#00CED1',
  '#FF4500', '#7FFF00', '#FF69B4', '#00FA9A',
  '#FFA07A', '#87CEEB', '#FF8C00', '#DA70D6',
]

const REVEAL_MESSAGES = [
  'You are amazing! 🌟',
  'Make a wish! ✨',
  'Best day ever! 🎉',
  'You deserve the world! ❤️',
  'Sending you big hugs! 🤗',
  'Shine bright! ☀️',
  'You light up every room! 💫',
  'So glad you were born! 🎂',
]

interface Balloon {
  id: number
  color: string
  left: string
  delay: number
  duration: number
  size: number
  popped: boolean
  popMsg: string
  isNameLetter: boolean
  letter?: string
  photoUrls?: string[]
  rotation: number
  swayAmount: number
}

export default function Balloons({ recipientName = '', photos = [] }: BalloonsProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [popConfetti, setPopConfetti] = useState<{ id: number; x: string; y: string } | null>(null)

  useEffect(() => {
    const letters = recipientName.toUpperCase().replace(/\s+/g, '').slice(0, 8).split('')
    const totalBalloons = Math.max(50, letters.length + (photos.length || 5) * 8)

    const newBalloons: Balloon[] = Array.from({ length: totalBalloons }, (_, i) => {
      const isNameLetter = i < letters.length
      
      let photoUrls: string[] | undefined = undefined;
      if (!isNameLetter && photos.length > 0) {
        photoUrls = [];
        const numPhotos = Math.min(3, photos.length);
        const shuffled = [...photos].sort(() => Math.random() - 0.5);
        for(let p = 0; p < numPhotos; p++) photoUrls.push(shuffled[p]);
      }

      return {
        id: i,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        left: `${2 + (i / totalBalloons) * 90 + (Math.random() - 0.5) * 8}%`,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 15,
        size: isNameLetter || photoUrls ? 90 + Math.random() * 30 : 60 + Math.random() * 40,
        popped: false,
        popMsg: REVEAL_MESSAGES[i % REVEAL_MESSAGES.length],
        isNameLetter,
        letter: isNameLetter ? letters[i] : undefined,
        photoUrls,
        rotation: (Math.random() - 0.5) * 15,
        swayAmount: 5 + Math.random() * 10
      }
    })
    setBalloons(newBalloons)
  }, [recipientName, photos])

  const handlePop = (id: number, left: string) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b))
    setPopConfetti({ id, x: left, y: `${20 + Math.random() * 60}%` })
    setTimeout(() => setPopConfetti(null), 1000)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {popConfetti && (
          <motion.div
            key={popConfetti.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
            style={{ left: popConfetti.x, top: popConfetti.y }}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>

      {balloons.map(b => (
        <AnimatePresence key={b.id}>
          {!b.popped ? (
            <motion.div
              initial={{ y: '110vh', rotate: b.rotation, x: 0 }}
              animate={{ 
                y: '-20vh', 
                rotate: [b.rotation, b.rotation + b.swayAmount, b.rotation - b.swayAmount, b.rotation],
                x: [0, b.swayAmount * 2, -b.swayAmount * 2, 0]
              }}
              exit={{
                scale: [1, 1.4, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              transition={{
                y: { duration: b.duration, delay: b.delay, ease: 'linear', repeat: Infinity },
                rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 5 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute pointer-events-auto cursor-pointer flex flex-col items-center select-none"
              style={{ left: b.left, bottom: 0 }}
              onClick={() => handlePop(b.id, b.left)}
              onTouchStart={() => handlePop(b.id, b.left)}
              whileHover={{ scale: 1.15, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.85 }}
            >
              <div
                className="relative flex items-center justify-center rounded-[50%] shadow-2xl transition-all"
                style={{
                  width: b.size,
                  height: b.size * 1.25,
                  background: `radial-gradient(circle at 35% 30%, ${b.color}ee, ${b.color})`,
                  boxShadow: `inset -6px -8px 16px rgba(0,0,0,0.3), inset 4px 6px 10px rgba(255,255,255,0.4), 0 10px 20px rgba(0,0,0,0.2)`,
                }}
              >
                {/* Glossy Reflection */}
                <div
                  className="absolute rounded-full bg-white/50 blur-[2px]"
                  style={{ width: b.size * 0.3, height: b.size * 0.2, top: '15%', left: '20%', transform: 'rotate(-25deg)' }}
                />

                {/* Name letter */}
                {b.isNameLetter && b.letter && (
                  <span
                    className="font-black text-white drop-shadow-lg select-none z-10"
                    style={{ fontSize: b.size * 0.45, textShadow: '0 4px 8px rgba(0,0,0,0.4)' }}
                  >
                    {b.letter}
                  </span>
                )}

                {/* Photo mapped onto balloon */}
                {b.photoUrls && b.photoUrls.length > 0 && (
                  <div
                    className="absolute inset-0 rounded-[50%] overflow-hidden"
                    style={{ transform: 'scale(0.85)' }}
                  >
                    {b.photoUrls.map((url, i) => (
                      <motion.img
                        key={i}
                        src={url}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                        initial={{ opacity: i === 0 ? 0.9 : 0 }}
                        animate={{ opacity: [0, 0.9, 0] }}
                        transition={{ 
                          duration: b.photoUrls!.length * 2, 
                          repeat: Infinity, 
                          delay: i * 2, 
                          ease: "easeInOut" 
                        }}
                        onError={(e: any) => { e.target.style.display = 'none' }}
                      />
                    ))}
                    {/* Shadow overlay to give it 3D spherical depth */}
                    <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_at_30%_30%,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                  </div>
                )}

                <div
                  className="absolute bottom-[-8px] w-4 h-4 rounded-[50%]"
                  style={{ background: b.color, filter: 'brightness(0.6)' }}
                />
              </div>

              <svg width="2" height="100" className="opacity-50 drop-shadow-md">
                <path d="M1 0 Q 8 25 1 50 Q -6 75 1 100" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.1, y: -100 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute pointer-events-none z-20"
              style={{ left: b.left, top: '40%' }}
            >
              <div className="bg-white/95 backdrop-blur-md text-slate-800 px-5 py-3 rounded-2xl font-bold shadow-2xl text-lg whitespace-nowrap border-2 border-pink-300">
                {b.popMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}
