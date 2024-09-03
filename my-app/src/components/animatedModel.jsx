import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const AnimatedModel = ({ type, position, scale }) => {
    // Define the model URLs
    const modelUrls = {
        spartan: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf',
        knight: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf',
        mage: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf',
        goblin: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf',
        ogre: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf',
        dragon: 'http://localhost:3000' + process.env.PUBLIC_URL + '/Spartan_idle.gltf'
    };

    // Ensure a URL is always available for the provided type
    const url = modelUrls[type];

    // Ensure `useLoader` is always called
    const gltf = useLoader(GLTFLoader, url);

    // Ensure `useRef` is always called
    const ref = useRef();


    // Ensure `gltf` and `gltf.scene` are valid
    if (!gltf || !gltf.scene) {
        console.error('GLTF model not loaded or missing scene:', url);
        return null;
    }

    return <primitive ref={ref} object={gltf.scene} scale={scale} position={position} />;
};

export default AnimatedModel;
