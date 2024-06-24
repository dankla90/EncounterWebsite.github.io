import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Hero = () => {
  
  const gltf = useLoader(GLTFLoader, './Spartan_idle.gltf');
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};


const ThreeDScene = () => {
  return (
    <>
    <OrbitControls />
      <mesh>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight color="red" position={[1, 1, 1]} />
          <Hero />
        </Suspense>
      </mesh>
    </>
  );
};

export default ThreeDScene;
