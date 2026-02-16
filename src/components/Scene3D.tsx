'use client';

import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Body } from '@/lib/physics';

interface Scene3DProps {
  bodies: Body[];
  showTrails: boolean;
}

export interface Scene3DHandle {
  resetCamera: () => void;
}

function BodyMesh({ body }: { body: Body }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = new THREE.Color(body.color);

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
  // Don't memoize — trail array is mutated each frame, we need fresh points every render
  if (body.trail.length < 2) return null;

  const points = body.trail.map((p) => new THREE.Vector3(p.x, p.y, p.z));

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

function CameraResetter({ resetSignal }: { resetSignal: number }) {
  const { camera } = useThree();
  const lastSignal = useRef(resetSignal);
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (resetSignal !== lastSignal.current) {
      lastSignal.current = resetSignal;
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    }
  });

  return null;
}

function SceneContent({ bodies, showTrails, resetSignal }: Scene3DProps & { resetSignal: number }) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const lastSignal = useRef(resetSignal);

  useFrame(() => {
    if (resetSignal !== lastSignal.current) {
      lastSignal.current = resetSignal;
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  });

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
        ref={controlsRef}
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

const Scene3D = forwardRef<Scene3DHandle, Scene3DProps & { resetSignal: number }>(
  function Scene3D({ bodies, showTrails, resetSignal }, ref) {
    const resetCamera = useCallback(() => {
      // Handled via resetSignal prop
    }, []);

    useImperativeHandle(ref, () => ({ resetCamera }), [resetCamera]);

    return (
      <div className="w-full h-full absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#0a0a0f' }}
        >
          <SceneContent bodies={bodies} showTrails={showTrails} resetSignal={resetSignal} />
        </Canvas>
      </div>
    );
  }
);

export default Scene3D;
