// ThreeDScene.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Hero = () => {
  const gltf = useLoader(GLTFLoader, "./Animations/Spartan_idle.glb");
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};


const Monster = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="red" />
  </mesh>
);

const ThreeDScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[0, 0, 5]} />
      <mesh>
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
};

export default ThreeDScene;
