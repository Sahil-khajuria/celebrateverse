'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import CandleFlame from './CandleFlame';

interface BirthdayCakeProps {
  theme?: string;
  candlesBlown?: boolean;
}

export default function BirthdayCake({ theme = 'classic_gold', candlesBlown = false }: BirthdayCakeProps) {
  const cakeRef = useRef<Group>(null);

  useFrame(() => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y += 0.005;
    }
  });

  const getColors = () => {
    switch (theme) {
      case 'pastel_dream': return { icing: '#FFB6C1', trim: '#E6E6FA' };
      case 'neon_night': return { icing: '#2a2a35', trim: '#00FF00' };
      default: return { icing: '#FFFDD0', trim: '#FFD700' };
    }
  };

  const colors = getColors();

  return (
    <group ref={cakeRef} position={[0, -1, 0]}>
      {/* Bottom Tier */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.2, 1.2, 32]} />
        <meshStandardMaterial color={colors.icing} roughness={0.3} />
      </mesh>

      {/* Middle Tier */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.7, 1, 32]} />
        <meshStandardMaterial color={colors.icing} roughness={0.3} />
      </mesh>

      {/* Top Tier */}
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 0.8, 32]} />
        <meshStandardMaterial color={colors.icing} roughness={0.3} />
      </mesh>

      {/* Decorations / Trim */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[2.2, 0.1, 16, 100]} />
        <meshStandardMaterial color={colors.trim} roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Candles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 3.2, z]}>
            <CandleFlame blown={candlesBlown} />
          </group>
        );
      })}
    </group>
  );
}
