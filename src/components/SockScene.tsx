"use client";

import { Float, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type SockProps = {
  position: [number, number, number];
  body: string;
  accent: string;
  stripe?: string;
};

function Sock({ position, body, accent, stripe = "#f8fafc" }: SockProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.4) * 0.22;
    group.current.rotation.z = Math.cos(t * 0.28) * 0.06;
  });

  return (
    <Float speed={1.35} rotationIntensity={0.45} floatIntensity={0.55}>
      <group ref={group} position={position}>
        <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
          <capsuleGeometry args={[0.2, 0.92, 10, 28]} />
          <meshStandardMaterial
            color={body}
            roughness={0.42}
            metalness={0.12}
          />
        </mesh>
        <mesh castShadow position={[0, 0.52, 0]}>
          <torusGeometry args={[0.24, 0.065, 14, 40]} />
          <meshStandardMaterial color={accent} roughness={0.5} metalness={0.08} />
        </mesh>
        <mesh castShadow position={[0, -0.18, 0.12]} rotation={[0.85, 0, 0]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color={body} roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 0.05, 0.21]} rotation={[1.2, 0, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.08]} />
          <meshStandardMaterial color={stripe} roughness={0.35} metalness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

export function SockScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 4.25], fov: 40 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        position={[4.5, 6, 3]}
        intensity={1.15}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.55} color="#fda4af" />
      <pointLight position={[3, 1.5, -2]} intensity={0.45} color="#93c5fd" />

      <Sock position={[-0.95, 0.05, 0]} body="#e85d04" accent="#0f172a" stripe="#fff7ed" />
      <Sock position={[0.05, -0.08, 0.15]} body="#7c3aed" accent="#f472b6" stripe="#ede9fe" />
      <Sock position={[1.05, 0.02, -0.05]} body="#0ea5e9" accent="#f97316" stripe="#e0f2fe" />

      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.38}
        scale={12}
        blur={2.6}
        far={4.5}
      />
    </Canvas>
  );
}
