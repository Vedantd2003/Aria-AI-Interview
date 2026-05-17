import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface OrbMeshProps {
  volumeLevel: number;
  isSpeaking: boolean;
}

function OrbMesh({ volumeLevel, isSpeaking }: OrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<{ distort: number; speed: number }>(null);
  const targetDistort = useRef(0);
  const targetScale = useRef(1);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    const intensity = isSpeaking ? 1.4 : 0.6;
    const desiredDistort = Math.min(0.8, volumeLevel * intensity * 1.2);
    const desiredScale = 1 + volumeLevel * intensity * 0.15;

    targetDistort.current = THREE.MathUtils.lerp(targetDistort.current, desiredDistort, delta * 4);
    targetScale.current = THREE.MathUtils.lerp(targetScale.current, desiredScale, delta * 5);

    meshRef.current.scale.setScalar(targetScale.current);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (matRef.current) {
      (matRef.current as any).distort = targetDistort.current;
    }

    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.07;
  });

  const color1 = useMemo(() => new THREE.Color('#8B5CF6'), []);
  const color2 = useMemo(() => new THREE.Color('#22D3EE'), []);

  return (
    <Sphere ref={meshRef} args={[1.4, 128, 128]}>
      <MeshDistortMaterial
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={matRef as any}
        color={color1}
        emissive={color2}
        emissiveIntensity={0.3}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.9 + Math.random() * 0.5;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const geoRef = useRef<THREE.BufferGeometry>(null);

  useFrame((_state, delta) => {
    if (geoRef.current?.attributes.position) {
      const pos = geoRef.current.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(_state.clock.elapsedTime * 0.5 + i) * delta * 0.01;
      }
      geoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8B5CF6"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface VoiceOrbProps {
  volumeLevel: number;
  isSpeaking: boolean;
}

export function VoiceOrb({ volumeLevel, isSpeaking }: VoiceOrbProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} color="#8B5CF6" intensity={2} />
        <pointLight position={[-5, -3, -5]} color="#22D3EE" intensity={1.5} />
        <OrbMesh volumeLevel={volumeLevel} isSpeaking={isSpeaking} />
        <Particles />
      </Canvas>
    </div>
  );
}
