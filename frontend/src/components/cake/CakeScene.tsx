'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import BirthdayCake from './BirthdayCake';

interface CakeSceneProps {
  theme?: string;
  candlesBlown?: boolean;
  onBlowComplete?: () => void;
}

export default function CakeScene({ theme = 'classic_gold', candlesBlown = false, onBlowComplete }: CakeSceneProps) {
  return (
    <div className="w-full h-[60vh] sm:h-[80vh]">
      <Canvas
        camera={{ position: [0, 3, 7], fov: 50 }}
        shadows
      >
        <fog attach="fog" args={['#0A0A0F', 5, 15]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <BirthdayCake theme={theme} candlesBlown={candlesBlown} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI/4}
          maxPolarAngle={Math.PI/2.2}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}
