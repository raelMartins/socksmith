"use client";

import {
  ContactShadows,
  Float,
  MeshDistortMaterial,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { BRAND } from "@/lib/brand";

/** Whole cluster gently follows the pointer for a tactile feel. */
function PointerTilt({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointer.x * 0.42;
    const targetX = -pointer.y * 0.28;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.07,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.07,
    );
  });

  return <group ref={group}>{children}</group>;
}

function HoverPop({
  children,
  position,
}: {
  children: React.ReactNode;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, hover ? 1.12 : 1, 0.11);
    ref.current.scale.setScalar(s);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {children}
    </group>
  );
}

export function PlayfulHeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 4.6], fov: 42 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[5, 8, 4]}
        intensity={1.05}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2, 2]} intensity={0.5} color={BRAND.pink} />
      <pointLight position={[4, 1, -2]} intensity={0.45} color={BRAND.blue} />

      <Sparkles
        count={55}
        scale={[10, 6, 4]}
        size={2.2}
        speed={0.35}
        opacity={0.45}
        color={BRAND.blush}
      />

      <PointerTilt>
        <Float speed={1.65} rotationIntensity={0.55} floatIntensity={0.5}>
          <HoverPop position={[-1.15, 0.05, 0]}>
            <mesh castShadow receiveShadow>
              <icosahedronGeometry args={[0.4, 1]} />
              <MeshDistortMaterial
                color={BRAND.red}
                roughness={0.28}
                metalness={0.35}
                distort={0.32}
                speed={2.2}
              />
            </mesh>
          </HoverPop>
        </Float>

        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.45}>
          <HoverPop position={[0.05, -0.05, 0.2]}>
            <mesh castShadow receiveShadow rotation={[0.4, 0.7, 0.2]}>
              <torusKnotGeometry args={[0.34, 0.1, 96, 12]} />
              <meshStandardMaterial
                color={BRAND.teal}
                metalness={0.45}
                roughness={0.22}
              />
            </mesh>
          </HoverPop>
        </Float>

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.55}>
          <HoverPop position={[1.12, 0.08, -0.05]}>
            <RoundedBox
              args={[0.62, 0.58, 0.58]}
              radius={0.1}
              smoothness={5}
              castShadow
              receiveShadow
              rotation={[0.25, 0.55, -0.15]}
            >
              <meshStandardMaterial
                color={BRAND.blue}
                metalness={0.25}
                roughness={0.35}
              />
            </RoundedBox>
          </HoverPop>
        </Float>

        <Float speed={2} rotationIntensity={0.65} floatIntensity={0.35}>
          <HoverPop position={[0.15, 0.65, -0.35]}>
            <mesh castShadow rotation={[0.9, 0.2, 0.4]}>
              <octahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial
                color={BRAND.pink}
                metalness={0.55}
                roughness={0.18}
                emissive={BRAND.pinkDark}
                emissiveIntensity={0.15}
              />
            </mesh>
          </HoverPop>
        </Float>
      </PointerTilt>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.32}
        scale={14}
        blur={2.8}
        far={5}
      />
    </Canvas>
  );
}
