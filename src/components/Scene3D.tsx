'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Body } from '@/lib/physics';

interface Scene3DProps {
  bodies: Body[];
  showTrails: boolean;
}

function BodyMesh({ body }: { body: Body }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(body.color), [body.color]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(body.position.x, body.position.y, body.position.z);
    }
  });

  return (
    <mesh ref={meshRef} position={[body.position.x, body.position.y, body.position.z]}>
      <sphereGeometry args={[body.size * 0.05, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.2}
      />
      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[body.size * 0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </mesh>
  );
}

function Trail({ body }: { body: Body }) {
  const points = useMemo(() => {
    if (body.trail.length < 2) return null;
    return body.trail.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  }, [body.trail]);

  if (!points) return null;

  return (
    <Line
      points={points}
      color={body.color}
      lineWidth={1.5}
      transparent
      opacity={0.5}
    />
  );
}

function SceneContent({ bodies, showTrails }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={2000} factor={3} fade speed={1} />
      
      {bodies.map((body, i) => (
        <BodyMesh key={i} body={body} />
      ))}
      
      {showTrails &&
        bodies.map((body, i) => <Trail key={`trail-${i}`} body={body} />)}
      
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </>
  );
}

export default function Scene3D({ bodies, showTrails }: Scene3DProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <SceneContent bodies={bodies} showTrails={showTrails} />
      </Canvas>
    </div>
  );
}
