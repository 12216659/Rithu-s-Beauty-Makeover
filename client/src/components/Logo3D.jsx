import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const LogoModel = ({ url, layers = 10, depth = 0.5, ...props }) => {
  const texture = useTexture(url);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slowly rotate the logo
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Faux 3D Extrusion using layered planes */}
      {Array.from({ length: layers }).map((_, i) => (
        <mesh key={i} position={[0, 0, (i - layers / 2) * (depth / layers)]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.5} 
            side={THREE.DoubleSide} 
            color={i === 0 || i === layers - 1 ? "white" : "#4a4a4a"} // Darker on the inside layers for depth
          />
        </mesh>
      ))}
    </group>
  );
};

const Logo3D = ({ url = "/logo-transparent.png", className = "w-16 h-16" }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <React.Suspense fallback={null}>
            <LogoModel url={url} layers={15} depth={0.2} />
          </React.Suspense>
        </Float>
      </Canvas>
    </div>
  );
};

export default Logo3D;
