"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from './utils';

export default function GlobeSphere() {
  const atmRef = useRef<THREE.Mesh>(null!);

  // Subtle atmosphere pulse
  useFrame(({ clock }) => {
    atmRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.6) * 0.008);
  });

  return (
    <group>
      {/* Main dark globe */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial color="#030808" roughness={1} metalness={0} />
      </mesh>

      {/* Atmosphere glow shell (neon blue) */}
      <mesh ref={atmRef}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.06, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
