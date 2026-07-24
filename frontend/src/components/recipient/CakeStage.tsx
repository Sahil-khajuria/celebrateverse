'use client'
import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from '@/components/celebration/Confetti'
import Fireworks from '@/components/celebration/Fireworks'
import { engagementApi } from '@/lib/apiEndpoints'
import * as THREE from 'three'

interface CakeStageProps {
  pageData: any
  isCalmMode: boolean
  onBlowComplete: () => void
  slug: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D SCENE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Flame({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      ref.current.scale.y = 0.9 + Math.sin(t * 15 + position[0]) * 0.15
      ref.current.scale.x = 0.9 + Math.cos(t * 12 + position[2]) * 0.1
      ref.current.position.y = position[1] + 0.15 + Math.sin(t * 10) * 0.02
    }
  })
  return (
    <group position={position}>
      <pointLight intensity={3} distance={5} color="#FFAA33" decay={2} castShadow />
      <group ref={ref} position={[0, 0.15, 0]}>
        <mesh>
          <coneGeometry args={[0.08, 0.35, 16]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <coneGeometry args={[0.04, 0.2, 16]} />
          <meshBasicMaterial color="#FFFF99" />
        </mesh>
      </group>
    </group>
  )
}

function Strawberry({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.35} rotation={[Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.3, 3]} />
        <meshPhysicalMaterial color="#C8102E" roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <coneGeometry args={[0.22, 0.15, 6]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Macaron({ position, color, rotation }: { position: [number, number, number], color: string, rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation} scale={0.35}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
        <meshStandardMaterial color="#FFFDD0" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.1} />
      </mesh>
    </group>
  )
}

function GiftBox({ position, color, ribbonColor, scale }: { position: [number, number, number], color: string, ribbonColor: string, scale: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, Math.random() * Math.PI, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Ribbons */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.02, 1.02, 0.2]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 1.02, 1.02]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.15, 0.05, 16, 32]} />
        <meshStandardMaterial color={ribbonColor} />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <torusGeometry args={[0.15, 0.05, 16, 32]} />
        <meshStandardMaterial color={ribbonColor} />
      </mesh>
    </group>
  )
}

function DecorBalloon({ position, color, floatSpeed }: { position: [number, number, number], color: string, floatSpeed: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * floatSpeed) * 0.3
    }
  })
  return (
    <group position={position} ref={ref}>
      <mesh castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial color={color} transmission={0.2} opacity={0.9} transparent roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function Sprinkles({ count, radius, height, yOffset }: { count: number, radius: number, height: number, yOffset: number }) {
  const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#FFFFFF', '#98FB98']
  const sprinkles = Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    return (
      <mesh key={i} position={[x, yOffset + height / 2 + 0.01, z]} rotation={[Math.PI / 2, 0, Math.random() * Math.PI]}>
        <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
        <meshStandardMaterial color={colors[Math.floor(Math.random() * colors.length)]} roughness={0.4} />
      </mesh>
    )
  })
  return <group>{sprinkles}</group>
}

function Piping({ radius, yOffset, color }: { radius: number, yOffset: number, color: string }) {
  const count = 40
  const blobs = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return (
      <mesh key={i} position={[x, yOffset, z]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.5} />
      </mesh>
    )
  })
  return <group>{blobs}</group>
}

function Cake3D({ isBlown, cakeTheme, onReady }: { isBlown: boolean; cakeTheme: string; onReady: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hasNotifiedReady, setHasNotifiedReady] = useState(false)
  
  // Premium Materials / Colors
  const frostingColor = cakeTheme === 'chocolate' ? '#2A1000' : cakeTheme === 'rainbow' ? '#FF99CC' : '#FFFAFA'
  const pipingColor = cakeTheme === 'chocolate' ? '#3E1C00' : cakeTheme === 'rainbow' ? '#FFFF99' : '#FFC0CB'
  const tier2Color = cakeTheme === 'chocolate' ? '#3A1500' : cakeTheme === 'rainbow' ? '#99CCFF' : '#FFF0F5'
  const tier3Color = cakeTheme === 'chocolate' ? '#4A1A00' : cakeTheme === 'rainbow' ? '#B19CD9' : '#FFFAFA'
  const baseColor = cakeTheme === 'chocolate' ? '#1A0800' : cakeTheme === 'rainbow' ? '#FFCC99' : '#FFE4E1'

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (!isBlown) {
        groupRef.current.rotation.y += 0.002
      }
      // Cinematic Entrance
      const t = Math.min(clock.getElapsedTime() / 4, 1)
      const easeOut = 1 - Math.pow(1 - t, 3)
      groupRef.current.position.z = -20 * (1 - easeOut)
      groupRef.current.position.y = -1.5 - 5 * (1 - easeOut)
      
      if (t === 1 && !hasNotifiedReady) {
        setHasNotifiedReady(true)
        onReady()
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Ambient environment sparkles */}
      <Sparkles count={100} scale={12} size={4} speed={0.4} opacity={0.2} color="#FFD700" />
      
      {/* Background Decor */}
      <DecorBalloon position={[-3.5, 2, -2]} color="#FF69B4" floatSpeed={1} />
      <DecorBalloon position={[3.5, 3, -3]} color="#87CEEB" floatSpeed={1.2} />
      <DecorBalloon position={[-2.5, 4, -4]} color="#FFD700" floatSpeed={0.8} />
      <DecorBalloon position={[2.5, 1.5, -2]} color="#98FB98" floatSpeed={1.1} />

      <GiftBox position={[-2, 0, 1.5]} color="#FF1493" ribbonColor="#FFFFFF" scale={0.7} />
      <GiftBox position={[2.2, 0, 1.2]} color="#4169E1" ribbonColor="#FFD700" scale={0.9} />
      <GiftBox position={[-1.2, 0, 2.5]} color="#9370DB" ribbonColor="#FFB6C1" scale={0.5} />

      {/* CAKE */}
      <group ref={groupRef}>
        {/* Luxury Plate */}
        <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.1, 64]} />
          <meshPhysicalMaterial color="#EAEAEA" metalness={0.9} roughness={0.05} clearcoat={1.0} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[2.5, 2.8, 0.2, 64]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>

        {/* Bottom tier */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.4, 1.2, 64]} />
          <meshPhysicalMaterial color={baseColor} roughness={0.1} metalness={0.1} clearcoat={0.1} />
        </mesh>
        <Piping radius={2.4} yOffset={0.15} color={pipingColor} />
        <mesh position={[0, 1.35, 0]} castShadow>
          <cylinderGeometry args={[2.45, 2.45, 0.15, 64]} />
          <meshPhysicalMaterial color={frostingColor} roughness={0.1} metalness={0.1} clearcoat={0.8} />
        </mesh>
        <Sprinkles count={300} radius={2.2} height={1.35} yOffset={0} />

        {/* Middle tier */}
        <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.7, 1.0, 64]} />
          <meshPhysicalMaterial color={baseColor} roughness={0.1} metalness={0.1} clearcoat={0.1} />
        </mesh>
        <Piping radius={1.7} yOffset={1.45} color={pipingColor} />
        <mesh position={[0, 2.45, 0]} castShadow>
          <cylinderGeometry args={[1.75, 1.75, 0.12, 64]} />
          <meshPhysicalMaterial color={tier2Color} roughness={0.1} metalness={0.1} clearcoat={0.8} />
        </mesh>
        <Sprinkles count={200} radius={1.5} height={2.45} yOffset={0} />

        {/* Top tier */}
        <mesh position={[0, 2.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.8, 64]} />
          <meshPhysicalMaterial color={baseColor} roughness={0.1} metalness={0.1} clearcoat={0.1} />
        </mesh>
        <Piping radius={1.1} yOffset={2.55} color={pipingColor} />
        <mesh position={[0, 3.35, 0]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.1, 64]} />
          <meshPhysicalMaterial color={tier3Color} roughness={0.1} metalness={0.1} clearcoat={0.8} />
        </mesh>
        <Sprinkles count={100} radius={0.9} height={3.35} yOffset={0} />

        {/* Macarons & Strawberries on tiers */}
        {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => {
          const r = 2.0;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          return <Strawberry key={`sb1-${i}`} position={[x, 1.5, z]} />
        })}
        {[Math.PI/4, Math.PI*3/4, Math.PI*5/4, Math.PI*7/4].map((angle, i) => {
          const r = 1.3;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          return <Macaron key={`mc1-${i}`} position={[x, 2.6, z]} color={['#FF1493', '#00FA9A', '#00BFFF', '#FF4500'][i]} rotation={[0, angle, 0.4]} />
        })}

        {/* Candles with melting wax */}
        {[
          [0, 3.7, 0], [0.4, 3.7, 0.4], [-0.4, 3.7, 0.4], [0.4, 3.7, -0.4], [-0.4, 3.7, -0.4]
        ].map((pos, i) => (
          <group key={`candle-${i}`} position={pos as [number, number, number]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.07, 0.6, 16]} />
              <meshPhysicalMaterial color={i % 2 === 0 ? '#FFF5EE' : '#FFDFD3'} roughness={0.4} clearcoat={0.5} transmission={0.1} />
            </mesh>
            {/* Melt drips */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshPhysicalMaterial color={i % 2 === 0 ? '#FFF5EE' : '#FFDFD3'} roughness={0.4} clearcoat={0.5} transmission={0.1} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
              <meshBasicMaterial color="#222222" />
            </mesh>
            {!isBlown && <Flame position={[0, 0.28, 0]} />}
            {isBlown && (
              <Float speed={2} floatIntensity={1}>
                <mesh position={[0, 0.4, 0]}>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshBasicMaterial color="#CCCCCC" transparent opacity={0.3} />
                </mesh>
              </Float>
            )}
          </group>
        ))}
      </group>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function CakeStage({ pageData, isCalmMode, onBlowComplete, slug }: CakeStageProps) {
  const [isBlown, setIsBlown] = useState(false)
  const [showPostBlow, setShowPostBlow] = useState(false)
  const [isCakeReady, setIsCakeReady] = useState(false)
  const [micError, setMicError] = useState(false)
  
  const clappingRef = useRef<HTMLAudioElement | null>(null)
  const cheeringRef = useRef<HTMLAudioElement | null>(null)
  const happyBdayRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)

  const handleBlow = () => {
    if (isBlown) return
    setIsBlown(true)
    engagementApi.logEvent(slug, 'CANDLE_BLOWN').catch(() => {})

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop())
    }

    if (!isCalmMode) {
      if (clappingRef.current) {
        clappingRef.current.volume = 0.85
        clappingRef.current.play().catch(() => {})
      }
      if (cheeringRef.current) {
        cheeringRef.current.volume = 0.7
        cheeringRef.current.play().catch(() => {})
      }
      if (happyBdayRef.current) {
        happyBdayRef.current.volume = 0.7
        happyBdayRef.current.play().catch(() => {})
      }
    }

    setShowPostBlow(true)
    setTimeout(() => onBlowComplete(), isCalmMode ? 2500 : 7000) // longer for cinematic feel
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isBlown) handleBlow()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isBlown])

  useEffect(() => {
    let animFrame: number
    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        micStreamRef.current = stream
        const actx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = actx
        const source = actx.createMediaStreamSource(stream)
        const analyser = actx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)

        const check = () => {
          if (isBlown) return
          analyser.getByteFrequencyData(data)
          const avg = data.slice(0, 40).reduce((a, b) => a + b, 0) / 40
          if (avg > 80) {
            handleBlow()
          } else {
            animFrame = requestAnimationFrame(check)
          }
        }
        check()
      } catch {
        setMicError(true)
      }
    }
    initMic()
    return () => {
      cancelAnimationFrame(animFrame)
      micStreamRef.current?.getTracks().forEach(t => t.stop())
      audioContextRef.current?.close()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      <audio ref={clappingRef} src="https://www.myinstants.com/media/sounds/applause-1.mp3" preload="auto" />
      <audio ref={cheeringRef} src="https://www.myinstants.com/media/sounds/crowd-cheer.mp3" preload="auto" />
      <audio ref={happyBdayRef} src="https://www.myinstants.com/media/sounds/happy-birthday.mp3" preload="auto" />

      {/* Cinematic gradient atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-black pointer-events-none" />

      <AnimatePresence>
        {!isBlown && isCakeReady && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-12 left-0 right-0 z-10 text-center px-4"
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_0_40px_rgba(253,224,71,0.6)] mb-4 tracking-tight animate-pulse">
              🎂 Make a wish...
            </h1>
            <p className="text-indigo-200/80 text-xl md:text-2xl font-bold tracking-wide max-w-lg mx-auto drop-shadow-md">
              {micError
                ? 'Click the magical button below to blow out the candles!'
                : 'Blow softly into your microphone • Press Space • or click the button below'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 3, 9], fov: 45 }} shadows dpr={[1, 2]}>
          <ambientLight intensity={isBlown ? 0.2 : 0.5} />
          <directionalLight position={[10, 15, 10]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
          <spotLight position={[-10, 10, 10]} intensity={0.4} angle={0.3} penumbra={1} castShadow />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!isBlown}
            autoRotateSpeed={1.2}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3}
          />
          <Cake3D isBlown={isBlown} cakeTheme={pageData?.cakeTheme || 'default'} onReady={() => setIsCakeReady(true)} />
        </Canvas>
      </div>

      <AnimatePresence>
        {!isBlown && isCakeReady && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            className="absolute bottom-12 z-10"
          >
            <motion.button
              onClick={handleBlow}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-xl md:text-2xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all flex items-center gap-4 group"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">🌬️</span>
              Blow Out Candles
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPostBlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            {!isCalmMode && <Confetti isActive mode="explosion" particleCount={800} />}
            {!isCalmMode && <Fireworks isActive burstCount={25} />}
            {!isCalmMode && <Confetti isActive mode="rain" particleCount={400} />}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2, type: "spring", bounce: 0.4 }}
              className="text-center z-30"
            >
              <div className="text-9xl mb-8 animate-bounce">🎉</div>
              <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)] mb-6">
                Happy Birthday!
              </h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-yellow-200 text-3xl font-serif italic"
              >
                ✨ Let the celebration begin... ✨
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
