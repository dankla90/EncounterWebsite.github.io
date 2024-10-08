import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Hero = () => {
  const urlSpartan = 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf'
  console.log(urlSpartan)
  const gltf = useLoader(GLTFLoader, urlSpartan);
  return (
    <React.Fragment>
      <primitive object={gltf.scene} scale={0.9} />
    </React.Fragment>
  );
};


const ThreeDScene = () => {
  return (
    <React.Fragment>
    <OrbitControls />
      <mesh>
        <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
          <directionalLight color="red" position={[10, 5, 1]} />
          <Hero />
        </Suspense>
      </mesh>
    </React.Fragment>
  );
};

export default ThreeDScene;