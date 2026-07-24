'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, Mesh } from 'three';

interface CandleFlameProps {
  blown?: boolean;
}

export default function CandleFlame({ blown = false }: CandleFlameProps) {
  const lightRef = useRef<PointLight>(null);
  const flameRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (blown) {
      if (flameRef.current) {
        flameRef.current.scale.setScalar(Math.max(0, flameRef.current.scale.x - 0.1));
      }
      if (lightRef.current) {
        lightRef.current.intensity = Math.max(0, lightRef.current.intensity - 0.1);
      }
      return;
    }

    const t = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 10) * 0.1;
      flameRef.current.scale.x = 1 + Math.sin(t * 20) * 0.05;
      flameRef.current.scale.z = 1 + Math.cos(t * 15) * 0.05;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(t * 15) * 0.2;
    }
  });

  return (
    <group>
      {/* Candle stick */}
      <mesh position={[0, -0.175, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
      </mesh>
      
      {/* Wick */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Flame */}
      {!blown && (
        <group position={[0, 0.14, 0]}>
          <mesh ref={flameRef}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshBasicMaterial color="#FF8C00" transparent opacity={0.8} />
          </mesh>
          <pointLight 
            ref={lightRef} 
            color="#FF8C00" 
            distance={5} 
            intensity={1} 
            decay={2} 
            castShadow 
          />
        </group>
      )}
    </group>
  );
}
